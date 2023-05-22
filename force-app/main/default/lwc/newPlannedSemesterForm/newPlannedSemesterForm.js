import { LightningElement, api, wire } from 'lwc';
import { RecordProxy, formatValue } from 'c/lib';
import { publish, MessageContext } from 'lightning/messageService';
import PlanOfStudyStream from '@salesforce/messageChannel/PlanOfStudyStream__c';
import getProgramEnrollmentId from '@salesforce/apex/PlanOfStudyController.getProgramEnrollmentId';
import getFutureSemesterOptions from '@salesforce/apex/PlanOfStudyController.getFutureSemesterOptions';

import SEMESTER_ID from '@salesforce/schema/Semester__c.Id';
import SEMESTER_TITLE from '@salesforce/schema/Semester__c.Semester_Title__c';

import ENROLLMENT_PLANNED_SEMESTER_SOBJECT from '@salesforce/schema/Enrollment_Planned_Semester__c';
import ENROLLMENT_PLANNED_SEMESTER_SEMESTER from '@salesforce/schema/Enrollment_Planned_Semester__c.Semester__c';
import ENROLLMENT_PLANNED_SEMESTER_PROGRAM_ENROLLMENT from '@salesforce/schema/Enrollment_Planned_Semester__c.Program_Enrollment__c';

const SEMESTER = {
    ID: SEMESTER_ID.fieldApiName,
    TITLE: SEMESTER_TITLE.fieldApiName
};

const ENROLLMENT_PLANNED_SEMESTER = {
    SOBJECT: ENROLLMENT_PLANNED_SEMESTER_SOBJECT.objectApiName,
    SEMESTER: ENROLLMENT_PLANNED_SEMESTER_SEMESTER.fieldApiName,
    PROGRAM_ENROLLMENT: ENROLLMENT_PLANNED_SEMESTER_PROGRAM_ENROLLMENT.fieldApiName
};

export default class NewPlannedSemesterForm extends LightningElement {
    @api studentId;
    _futureSemesterOptions;
    _plannedSemester;

    get futureSemesterOptions() {
        return this._futureSemesterOptions?.map((semester) => ({
            label: formatValue({ field: SEMESTER.TITLE, record: semester }),
            value: formatValue({ field: SEMESTER.ID, record: semester })
        }));
    }

    @wire(MessageContext) _messageContext;

    @api open() {
        this._reset();
        this.template.querySelector('c-modal').open();
    }

    handleCancel() {
        this._reset();
        this.template.querySelector('c-modal').close();
    }

    handleSemesterChange(event) {
        const { value } = event.target;
        this._plannedSemester.add(ENROLLMENT_PLANNED_SEMESTER.SEMESTER, value);
        this._getCombobox().setCustomValidity('');
        this._getCombobox().reportValidity();
    }

    async handleSave() {
        try {
            if (!this._plannedSemester.fields.Semester__c) {
                this._getCombobox().setCustomValidity('Please select a semester.');
                this._getCombobox().reportValidity();
                return;
            }

            this.template.querySelector('c-modal').showSpinner();
            const { id } = await this._plannedSemester.insert();

            if (id) {
                publish(this._messageContext, PlanOfStudyStream);
                this.template.querySelector('c-modal').close();
            }
        } catch (error) {
            throw new Error(JSON.stringify(error, null, 4));
        } finally {
            this.template.querySelector('c-modal').hideSpinner();
        }
    }

    _getCombobox() {
        return this.template.querySelector('lightning-combobox');
    }

    async _reset() {
        try {
            this._futureSemesterOptions = await getFutureSemesterOptions({ studentId: this.studentId });
            this._plannedSemester = new RecordProxy(ENROLLMENT_PLANNED_SEMESTER.SOBJECT);
            this._plannedSemester.add(
                ENROLLMENT_PLANNED_SEMESTER.PROGRAM_ENROLLMENT,
                await getProgramEnrollmentId({ studentId: this.studentId })
            );
        } catch (error) {
            throw new Error(JSON.stringify(error, null, 4));
        }
    }
}