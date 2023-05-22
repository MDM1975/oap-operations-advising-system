import { LightningElement, api } from 'lwc';
import { Query, formatValue } from 'c/lib';

import CASE_SOBJECT from '@salesforce/schema/Case';
import CASE_ID from '@salesforce/schema/Case.Id';
import CASE_SUBJECT from '@salesforce/schema/Case.Subject';
import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import CASE_DESCRIPTION from '@salesforce/schema/Case.Description';
import CASE_STATUS from '@salesforce/schema/Case.Status';
import CASE_RECORD_TYPE from '@salesforce/schema/Case.RecordType.Name';
import CASE_CREATED_DATE from '@salesforce/schema/Case.CreatedDate';
import CASE_STUDENT from '@salesforce/schema/Case.Student__c';
import CASE_STUDENT_NAME from '@salesforce/schema/Case.Student__r.Name';
import CASE_STUDENT_EMAIL from '@salesforce/schema/Case.Student__r.Email';
import CASE_STUDENT_UNIVERSITY_ID from '@salesforce/schema/Case.Student__r.University_Id__c';
import CASE_PROGRAM from '@salesforce/schema/Case.Program__c';
import CASE_PROGRAM_NAME from '@salesforce/schema/Case.Program__r.Name';

const CASE = {
    SOBJECT: CASE_SOBJECT.objectApiName,
    ID: CASE_ID.fieldApiName,
    SUBJECT: CASE_SUBJECT.fieldApiName,
    DESCRIPTION: CASE_DESCRIPTION.fieldApiName,
    OWNER_NAME: 'Case.Owner.Name',
    CASE_NUMBER: CASE_NUMBER.fieldApiName,
    STATUS: CASE_STATUS.fieldApiName,
    RECORD_TYPE: CASE_RECORD_TYPE.fieldApiName,
    CREATED_DATE: CASE_CREATED_DATE.fieldApiName,
    STUDENT: CASE_STUDENT.fieldApiName,
    STUDENT_NAME: CASE_STUDENT_NAME.fieldApiName,
    PROGRAM: CASE_PROGRAM.fieldApiName,
    PROGRAM_NAME: CASE_PROGRAM_NAME.fieldApiName,
    STUDENT_EMAIL: CASE_STUDENT_EMAIL.fieldApiName,
    STUDENT_UNIVERSITY_ID: CASE_STUDENT_UNIVERSITY_ID.fieldApiName
};

export default class CaseDetailCard extends LightningElement {
    @api recordId;
    _recordType;

    get recordType() {
        return new Query()
            .select([CASE.RECORD_TYPE])
            .from(CASE.SOBJECT)
            .where([CASE.ID, '=', this.recordId])
            .submit();
    }

    get isOperations() {
        return this._recordType === 'Operations';
    }

    get isProgramEnrollment() {
        return this._recordType === 'Program Enrollment';
    }

    get caseSObject() {
        return CASE.SOBJECT;
    }

    get filterBy() {
        return {
            field: CASE.ID,
            operator: '=',
            value: this.recordId
        };
    }

    get programEnrollmentFields() {
        return [
            {
                label: 'Subject',
                name: CASE.SUBJECT,
                type: 'text',
                readonly: true
            },
            {
                label: 'Case Number',
                name: CASE.CASE_NUMBER,
                type: 'url',
                readonly: true
            },
            {
                label: 'Status',
                name: CASE.STATUS,
                type: 'picklist',
                readonly: false,
                options: {
                    sobject: CASE.SOBJECT,
                    field: CASE.STATUS
                }
            },
            {
                label: 'Created Date',
                name: CASE.CREATED_DATE,
                type: 'date',
                readonly: true
            },
            {
                label: 'Student',
                name: CASE.STUDENT_NAME,
                type: 'url',
                readonly: true,
                url: {
                    page: 'student',
                    param: CASE.STUDENT
                }
            },
            {
                label: 'Student Personal Email',
                name: CASE.STUDENT_EMAIL,
                type: 'email',
                readonly: true
            },
            {
                label: 'Student University ID',
                name: CASE.STUDENT_UNIVERSITY_ID,
                type: 'text',
                readonly: true
            },
            {
                label: 'Program',
                name: CASE.PROGRAM_NAME,
                type: 'text',
                readonly: true,
                url: {
                    page: 'program',
                    param: CASE.PROGRAM
                }
            },
            {
                label: 'Description',
                name: CASE.DESCRIPTION,
                type: 'textarea',
                readonly: true
            }
        ];
    }

    get operationsFields() {
        return [
            {
                label: 'Subject',
                name: CASE.SUBJECT,
                type: 'text',
                readonly: true
            },
            {
                label: 'Case Number',
                name: CASE.CASE_NUMBER,
                type: 'url',
                readonly: true
            },
            {
                label: 'Status',
                name: CASE.STATUS,
                type: 'picklist',
                readonly: false,
                options: {
                    sobject: CASE.SOBJECT,
                    field: CASE.STATUS
                }
            },
            {
                label: 'Created Date',
                name: CASE.CREATED_DATE,
                type: 'date',
                readonly: true
            },
            {
                label: 'Description',
                name: CASE.DESCRIPTION,
                type: 'textarea',
                readonly: true
            }
        ];
    }

    handleResolved(event) {
        const {
            data: [recordType]
        } = event.detail;

        this._recordType = formatValue({ field: CASE.RECORD_TYPE, record: recordType });
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }
}