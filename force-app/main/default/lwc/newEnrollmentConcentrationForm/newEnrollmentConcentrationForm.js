import { LightningElement, api } from 'lwc';
import { Query, formatValue, RecordProxy } from 'c/lib';

import CONCENTRATION_SOBJECT from '@salesforce/schema/Concentration__c';
import CONCENTRATION_ID from '@salesforce/schema/Concentration__c.Id';
import CONCENTRATION_NAME from '@salesforce/schema/Concentration__c.Name';
import CONCENTRATION_PROGRAM from '@salesforce/schema/Concentration__c.Program__c';
import CONCENTRATION_PROGRAM_NAME from '@salesforce/schema/Concentration__c.Program__r.Name';

import ENROLLMENT_CONCENTRATION_SOBJECT from '@salesforce/schema/Enrollment_Concentration__c';
import ENROLLMENT_CONCENTRATION_CONCENTRATION from '@salesforce/schema/Enrollment_Concentration__c.Concentration__c';
import ENROLLMENT_CONCENTRATION_CONCENTRATION_NAME from '@salesforce/schema/Enrollment_Concentration__c.Concentration__r.Name';
import ENROLLMENT_CONCENTRATION_PROGRAM_ENROLLMENT from '@salesforce/schema/Enrollment_Concentration__c.Program_Enrollment__c';
import ENROLLMENT_CONCENTRATION_PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Enrollment_Concentration__c.Program_Enrollment__r.Student__c';

const CONCENTRATION = {
    SOBJECT: CONCENTRATION_SOBJECT.objectApiName,
    ID: CONCENTRATION_ID.fieldApiName,
    NAME: CONCENTRATION_NAME.fieldApiName,
    PROGRAM: CONCENTRATION_PROGRAM.fieldApiName,
    PROGRAM_NAME: CONCENTRATION_PROGRAM_NAME.fieldApiName
};

const ENROLLMENT_CONCENTRATION = {
    SOBJECT: ENROLLMENT_CONCENTRATION_SOBJECT.objectApiName,
    CONCENTRATION: ENROLLMENT_CONCENTRATION_CONCENTRATION.fieldApiName,
    CONCENTRATION_NAME: ENROLLMENT_CONCENTRATION_CONCENTRATION_NAME.fieldApiName,
    PROGRAM_ENROLLMENT: ENROLLMENT_CONCENTRATION_PROGRAM_ENROLLMENT.fieldApiName,
    PROGRAM_ENROLLMENT_STUDENT: ENROLLMENT_CONCENTRATION_PROGRAM_ENROLLMENT_STUDENT.fieldApiName
};

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_ID from '@salesforce/schema/Program_Enrollment__c.Id';
import PROGRAM_ENROLLMENT_PROGRAM from '@salesforce/schema/Program_Enrollment__c.Program__c';
import PROGRAM_ENROLLMENT_PROGRAM_NAME from '@salesforce/schema/Program_Enrollment__c.Program__r.Name';
import PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Program_Enrollment__c.Student__c';

const PROGRAM_ENROLLMENT = {
    SOBJECT: PROGRAM_ENROLLMENT_SOBJECT.objectApiName,
    ID: PROGRAM_ENROLLMENT_ID.fieldApiName,
    PROGRAM: PROGRAM_ENROLLMENT_PROGRAM.fieldApiName,
    PROGRAM_NAME: PROGRAM_ENROLLMENT_PROGRAM_NAME.fieldApiName,
    STUDENT: PROGRAM_ENROLLMENT_STUDENT.fieldApiName
};

export default class NewEnrollmentConcentrationForm extends LightningElement {
    @api studentId;
    _programName;
    _concentrationOptions;
    _enrollmentConcentration;

    get programEnrollment() {
        return new Query()
            .select([PROGRAM_ENROLLMENT.ID, PROGRAM_ENROLLMENT.PROGRAM_NAME])
            .from(PROGRAM_ENROLLMENT.SOBJECT)
            .where([PROGRAM_ENROLLMENT.STUDENT, '=', this.studentId])
            .submit();
    }

    get program() {
        return this._programName;
    }

    get hasConcentrationOptions() {
        return this._concentrationOptions && this._concentrationOptions.length > 0;
    }

    get concentrationOptions() {
        return this._concentrationOptions?.map((concentration) => ({
            label: concentration?.[CONCENTRATION.NAME],
            value: concentration?.[CONCENTRATION.ID]
        }));
    }

    @api open() {
        this.template.querySelector('c-modal').open();
    }

    async handleResolved(event) {
        const {
            data: [programEnrollment]
        } = event.detail;

        this._programName = formatValue({ field: PROGRAM_ENROLLMENT.PROGRAM_NAME, record: programEnrollment });

        this._concentrationOptions = ['OMBA', 'EMBA'].includes(this._programName)
            ? await new Query()
                  .select([CONCENTRATION.NAME])
                  .from(CONCENTRATION.SOBJECT)
                  .where([CONCENTRATION.PROGRAM_NAME, '=', 'OMBA'])
                  .submit()
            : await new Query()
                  .select([CONCENTRATION.NAME])
                  .from(CONCENTRATION.SOBJECT)
                  .where([CONCENTRATION.PROGRAM_NAME, '=', this.program])
                  .submit();

        this._enrollmentConcentration = new RecordProxy(ENROLLMENT_CONCENTRATION.SOBJECT);

        this._enrollmentConcentration.add(
            ENROLLMENT_CONCENTRATION.PROGRAM_ENROLLMENT,
            formatValue({
                field: PROGRAM_ENROLLMENT.ID,
                record: programEnrollment
            })
        );
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }

    handleCancel() {
        this.template.querySelector('c-modal').close();
    }

    handleConcentrationChange(event) {
        const { value } = event.detail;

        if (!value) {
            return;
        }

        this._enrollmentConcentration.add(ENROLLMENT_CONCENTRATION.CONCENTRATION, value);
        const combobox = this.template.querySelector('lightning-combobox');
        combobox.setCustomValidity('');
        combobox.reportValidity();
    }

    async handleSave() {
        try {
            if (!this._enrollmentConcentration.fields?.[ENROLLMENT_CONCENTRATION.CONCENTRATION]) {
                const combobox = this.template.querySelector('lightning-combobox');
                combobox.setCustomValidity('Please select a concentration.');
                combobox.reportValidity();
                return;
            }

            const { id } = await this._enrollmentConcentration.insert();

            if (id) {
                this._refresh();
                this.dispatchEvent(new CustomEvent('success'));
                this.template.querySelector('c-modal').close();
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            throw new Error(`Failed to save enrollment concentration: ${error?.body?.message}`);
        }
    }

    async _refresh() {
        const programEnrollment = await this.programEnrollment;
        this._enrollmentConcentration = new RecordProxy(ENROLLMENT_CONCENTRATION.SOBJECT);
        this._enrollmentConcentration.add(
            ENROLLMENT_CONCENTRATION.PROGRAM_ENROLLMENT,
            formatValue({
                field: PROGRAM_ENROLLMENT.ID,
                record: programEnrollment
            })
        );
    }
}