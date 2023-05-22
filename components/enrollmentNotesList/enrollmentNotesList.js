import { LightningElement, api } from 'lwc';
import { Query } from 'c/lib';

import ENROLLMENT_NOTES_SOBJECT from '@salesforce/schema/Enrollment_Notes__c';
import ENROLLMENT_NOTES_BODY from '@salesforce/schema/Enrollment_Notes__c.Body__c';
import ENROLLMENT_NOTES_PROGRAM_ENROLLMENT from '@salesforce/schema/Enrollment_Notes__c.Program_Enrollment__c';
import ENROLLMENT_NOTES_PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Enrollment_Notes__c.Program_Enrollment__r.Student__c';
import ENROLLMENT_NOTES_CREATED_DATE from '@salesforce/schema/Enrollment_Notes__c.CreatedDate';
import ENROLLMENT_NOTES_CREATED_BY from '@salesforce/schema/Enrollment_Notes__c.CreatedBy.Name';

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_ID from '@salesforce/schema/Program_Enrollment__c.Id';
import PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Program_Enrollment__c.Student__c';

const ENROLLMENT_NOTES = {
    SOBJECT: ENROLLMENT_NOTES_SOBJECT.objectApiName,
    BODY: ENROLLMENT_NOTES_BODY.fieldApiName,
    PROGRAM_ENROLLMENT: ENROLLMENT_NOTES_PROGRAM_ENROLLMENT.fieldApiName,
    PROGRAM_ENROLLMENT_STUDENT: ENROLLMENT_NOTES_PROGRAM_ENROLLMENT_STUDENT.fieldApiName,
    CREATED_DATE: ENROLLMENT_NOTES_CREATED_DATE.fieldApiName,
    CREATED_BY: ENROLLMENT_NOTES_CREATED_BY.fieldApiName
};

const PROGRAM_ENROLLMENT = {
    SOBJECT: PROGRAM_ENROLLMENT_SOBJECT.objectApiName,
    ID: PROGRAM_ENROLLMENT_ID.fieldApiName,
    STUDENT: PROGRAM_ENROLLMENT_STUDENT.fieldApiName
};

export default class EnrollmentNotesList extends LightningElement {
    @api recordId;
    @api listSize;
    _programEnrollmentId;

    get programEnrollment() {
        return new Query()
            .select([PROGRAM_ENROLLMENT.ID])
            .from(PROGRAM_ENROLLMENT.SOBJECT)
            .where([PROGRAM_ENROLLMENT.STUDENT, '=', this.recordId])
            .submit();
    }

    get enrollmentNotesSObject() {
        return ENROLLMENT_NOTES.SOBJECT;
    }

    get filterBy() {
        return {
            field: ENROLLMENT_NOTES.PROGRAM_ENROLLMENT_STUDENT,
            operator: '=',
            value: this.recordId
        };
    }

    get sortBy() {
        return {
            field: ENROLLMENT_NOTES.CREATED_DATE,
            direction: 'desc'
        };
    }

    get listFields() {
        return [
            {
                label: 'Body',
                name: ENROLLMENT_NOTES.BODY,
                type: 'text',
                readonly: true
            },
            {
                label: 'Created Date',
                name: ENROLLMENT_NOTES.CREATED_DATE,
                type: 'date',
                readonly: true
            },
            {
                label: 'Created By',
                name: ENROLLMENT_NOTES.CREATED_BY,
                type: 'text',
                readonly: true
            }
        ];
    }

    get formFields() {
        return [
            {
                label: 'Body',
                name: ENROLLMENT_NOTES.BODY,
                type: 'textarea',
                required: true
            }
        ];
    }

    handleResolved(event) {
        const [programEnrollment] = event.detail.data;
        this._programEnrollmentId = programEnrollment?.[PROGRAM_ENROLLMENT.ID];
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }

    handleAddNote() {
        const form = this.template.querySelector('c-record-form');
        form.open();
        form.updateRecord(ENROLLMENT_NOTES.PROGRAM_ENROLLMENT, this._programEnrollmentId);
    }

    handleSuccess() {
        this.template.querySelector('c-related-record-list').refresh();
    }
}