import { LightningElement, api } from 'lwc';
import { Query } from 'c/lib';

import CONTACT_SOBJECT from '@salesforce/schema/Contact';
import CONTACT_ID from '@salesforce/schema/Contact.Id';
import CONTACT_FIRST_NAME from '@salesforce/schema/Contact.FirstName';
import CONTACT_LAST_NAME from '@salesforce/schema/Contact.LastName';
import CONTACT_UNCW_EMPLOYEE from '@salesforce/schema/Contact.UNCW_Employee__c';
import CONTACT_UNC_SYSTEM_EMPLOYEE from '@salesforce/schema/Contact.UNC_System_Employee__c';
import CONTACT_PROSPECTIVE_PROGRAM from '@salesforce/schema/Contact.Primary_Program__c';
import CONTACT_UNIVERSITY_ID from '@salesforce/schema/Contact.University_Id__c';
import CONTACT_RECORD_TYPE_ID from '@salesforce/schema/Contact.RecordTypeId';

import PROGRAM_SOBJECT from '@salesforce/schema/Program__c';
import PROGRAM_ID from '@salesforce/schema/Program__c.Id';
import PROGRAM_NAME from '@salesforce/schema/Program__c.Name';
import PROGRAM_ACTIVE from '@salesforce/schema/Program__c.Active__c';

const CONTACT = {
    SOBJECT: CONTACT_SOBJECT.objectApiName,
    ID: CONTACT_ID.fieldApiName,
    FIRST_NAME: CONTACT_FIRST_NAME.fieldApiName,
    LAST_NAME: CONTACT_LAST_NAME.fieldApiName,
    UNCW_EMPLOYEE: CONTACT_UNCW_EMPLOYEE.fieldApiName,
    UNC_SYSTEM_EMPLOYEE: CONTACT_UNC_SYSTEM_EMPLOYEE.fieldApiName,
    PROSPECTIVE_PROGRAM: CONTACT_PROSPECTIVE_PROGRAM.fieldApiName,
    UNIVERSITY_ID: CONTACT_UNIVERSITY_ID.fieldApiName,
    RECORD_TYPE_ID: CONTACT_RECORD_TYPE_ID.fieldApiName
};

const PROGRAM = {
    SOBJECT: PROGRAM_SOBJECT.objectApiName,
    ID: PROGRAM_ID.fieldApiName,
    NAME: PROGRAM_NAME.fieldApiName,
    ACTIVE: PROGRAM_ACTIVE.fieldApiName
};

export default class NewStudentForm extends LightningElement {
    get contactSObject() {
        return CONTACT.SOBJECT;
    }

    get fields() {
        return [
            {
                label: 'First Name',
                name: CONTACT.FIRST_NAME,
                type: 'text',
                required: true
            },
            {
                label: 'Last Name',
                name: CONTACT.LAST_NAME,
                type: 'text',
                required: true
            },
            {
                label: 'Program',
                name: CONTACT.PROSPECTIVE_PROGRAM,
                type: 'lookup',
                required: true,
                options: {
                    query: new Query().select([PROGRAM.NAME]).from(PROGRAM.SOBJECT).where([PROGRAM.ACTIVE, '=', true]),
                    label: PROGRAM.NAME,
                    value: PROGRAM.ID
                }
            },
            {
                label: 'University ID',
                name: CONTACT.UNIVERSITY_ID,
                type: 'text',
                maxlength: 9,
                minlength: 9,
                required: true
            },
            {
                label: 'UNCW Employee',
                name: CONTACT.UNCW_EMPLOYEE,
                type: 'checkbox',
                required: false
            },
            {
                label: 'UNC System Employee',
                name: CONTACT.UNC_SYSTEM_EMPLOYEE,
                type: 'checkbox',
                required: false
            }
        ];
    }

    @api open() {
        this.template.querySelector('c-record-form').open();
    }

    handleSuccess(event) {
        const { id: studentId } = event.detail;
        this.template.querySelector('c-record-form').navigate(studentId);
    }
}