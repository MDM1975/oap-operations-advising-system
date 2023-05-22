import { LightningElement, api } from 'lwc';
import { Query, formatRelationshipName, formatValue } from 'c/lib';

import CONCENTRATION_SOBJECT from '@salesforce/schema/Concentration__c';
import CONCENTRATION_ID from '@salesforce/schema/Concentration__c.Id';
import CONCENTRATION_NAME from '@salesforce/schema/Concentration__c.Name';

import CONCENTRATION_COURSE_SOBJECT from '@salesforce/schema/Concentration_Course__c';
import CONCENTRATION_COURSE_COURSE from '@salesforce/schema/Concentration_Course__c.Course__c';
import CONCENTRATION_COURSE_COURSE_TITLE from '@salesforce/schema/Concentration_Course__c.Course__r.Course_Title__c';

import ENROLLMENT_CONCENTRATION_SOBJECT from '@salesforce/schema/Enrollment_Concentration__c';
import ENROLLMENT_CONCENTRATION_CONCENTRATION from '@salesforce/schema/Enrollment_Concentration__c.Concentration__c';
import ENROLLMENT_CONCENTRATION_PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Enrollment_Concentration__c.Program_Enrollment__r.Student__c';

const CONCENTRATION = {
    SOBJECT: CONCENTRATION_SOBJECT.objectApiName,
    ID: CONCENTRATION_ID.fieldApiName,
    NAME: CONCENTRATION_NAME.fieldApiName
};

const CONCENTRATION_COURSE = {
    SOBJECT: formatRelationshipName({ sobject: CONCENTRATION_COURSE_SOBJECT.objectApiName }),
    COURSE: CONCENTRATION_COURSE_COURSE.fieldApiName,
    COURSE_TITLE: CONCENTRATION_COURSE_COURSE_TITLE.fieldApiName
};

const ENROLLMENT_CONCENTRATION = {
    SOBJECT: ENROLLMENT_CONCENTRATION_SOBJECT.objectApiName,
    CONCENTRATION: ENROLLMENT_CONCENTRATION_CONCENTRATION.fieldApiName,
    PROGRAM_ENROLLMENT_STUDENT: ENROLLMENT_CONCENTRATION_PROGRAM_ENROLLMENT_STUDENT.fieldApiName
};

export default class EnrollmentConcentrationsList extends LightningElement {
    @api recordId;
    _concentrations;

    get enrollmentConcentrations() {
        return new Query()
            .select([
                CONCENTRATION.NAME,
                new Query().select([CONCENTRATION_COURSE.COURSE_TITLE]).from(CONCENTRATION_COURSE.SOBJECT)
            ])
            .from(CONCENTRATION.SOBJECT)
            .where([
                CONCENTRATION.ID,
                'IN',
                new Query()
                    .select([ENROLLMENT_CONCENTRATION.CONCENTRATION])
                    .from(ENROLLMENT_CONCENTRATION.SOBJECT)
                    .where([ENROLLMENT_CONCENTRATION.PROGRAM_ENROLLMENT_STUDENT, '=', this.recordId])
            ])
            .submit();
    }

    get hasConcentrations() {
        return this._concentrations && this._concentrations.length > 0;
    }

    get concentrations() {
        return this._concentrations?.map((concentration) => ({
            name: concentration?.[CONCENTRATION.NAME],
            courses: concentration?.[CONCENTRATION_COURSE.SOBJECT]?.map((course) => ({
                id: formatValue({ field: CONCENTRATION_COURSE.COURSE, record: course }),
                title: formatValue({ field: CONCENTRATION_COURSE.COURSE_TITLE, record: course })
            }))
        }));
    }

    get title() {
        return `Concentration${this._concentrations?.length > 1 ? 's' : ''}`;
    }

    async connectedCallback() {
        this._concentrations = await this.enrollmentConcentrations;
    }

    handleAddConcentration() {
        this.template.querySelector('c-new-enrollment-concentration-form').open();
    }

    handleSuccess() {
        this._refresh();
    }

    async _refresh() {
        try {
            this._concentrations = await this.enrollmentConcentrations;
            this._concentrations = [...this._concentrations];
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
            throw new Error(`Failed to refresh enrollment concentrations: ${error?.body?.message}`);
        }
    }
}