import { LightningElement, api } from 'lwc';

import CASE_SOBJECT from '@salesforce/schema/Case';
import CASE_ID from '@salesforce/schema/Case.Id';
import CASE_SUBJECT from '@salesforce/schema/Case.Subject';
import CASE_DESCRIPTION from '@salesforce/schema/Case.Description';
import CASE_RECORD_TYPE from '@salesforce/schema/Case.RecordType.Name';
import CASE_STUDENT from '@salesforce/schema/Case.Student__c';
import CASE_PROGRAM from '@salesforce/schema/Case.Program__c';

const CASE = {
    SOBJECT: CASE_SOBJECT.objectApiName,
    ID: CASE_ID.fieldApiName,
    SUBJECT: CASE_SUBJECT.fieldApiName,
    DESCRIPTION: CASE_DESCRIPTION.fieldApiName,
    RECORD_TYPE: CASE_RECORD_TYPE.fieldApiName,
    STUDENT: CASE_STUDENT.fieldApiName,
    PROGRAM: CASE_PROGRAM.fieldApiName
};

export default class NewCaseForm extends LightningElement {
    get caseSObject() {
        return CASE.SOBJECT;
    }

    get fields() {
        return [
            {
                label: 'Subject',
                name: CASE.SUBJECT,
                type: 'text',
                required: true
            },
            {
                label: 'Description',
                name: CASE.DESCRIPTION,
                type: 'textarea',
                required: true
            }
        ];
    }

    @api open() {
        this.template.querySelector('c-record-form').open();
    }

    handleSuccess(event) {
        const { id: caseId } = event.detail;
        this.template.querySelector('c-record-form').navigate(caseId);
    }
}