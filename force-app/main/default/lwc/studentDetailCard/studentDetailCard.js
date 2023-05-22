import { LightningElement, api } from 'lwc';

import CONTACT_SOBJECT from '@salesforce/schema/Contact';
import CONTACT_ID from '@salesforce/schema/Contact.Id';
import CONTACT_NAME from '@salesforce/schema/Contact.Name';
import CONTACT_UNC_SYSTEM_EMPLOYEE from '@salesforce/schema/Contact.UNC_System_Employee__c';
import CONTACT_UNCW_EMPLOYEE from '@salesforce/schema/Contact.UNCW_Employee__c';
import CONTACT_UNCW_EMAIL from '@salesforce/schema/Contact.UNCW_Email__c';
import CONTACT_EMAIL from '@salesforce/schema/Contact.Email';
import CONTACT_UNIVERSITY_ID from '@salesforce/schema/Contact.University_Id__c';
import CONTACT_MOBILE_PHONE from '@salesforce/schema/Contact.MobilePhone';

const CONTACT = {
    SOBJECT: CONTACT_SOBJECT.objectApiName,
    ID: CONTACT_ID.fieldApiName,
    NAME: CONTACT_NAME.fieldApiName,
    UNC_SYSTEM_EMPLOYEE: CONTACT_UNC_SYSTEM_EMPLOYEE.fieldApiName,
    UNCW_EMPLOYEE: CONTACT_UNCW_EMPLOYEE.fieldApiName,
    UNCW_EMAIL: CONTACT_UNCW_EMAIL.fieldApiName,
    EMAIL: CONTACT_EMAIL.fieldApiName,
    UNIVERSITY_ID: CONTACT_UNIVERSITY_ID.fieldApiName,
    MOBILE_PHONE: CONTACT_MOBILE_PHONE.fieldApiName
};

export default class StudentDetailCard extends LightningElement {
    @api recordId;

    get contactSObject() {
        return CONTACT.SOBJECT;
    }

    get filterBy() {
        return {
            field: CONTACT.ID,
            operator: '=',
            value: this.recordId
        };
    }

    get fields() {
        return [
            {
                label: 'Name',
                name: CONTACT.NAME,
                type: 'text',
                readonly: false
            },
            {
                label: 'University ID',
                name: CONTACT.UNIVERSITY_ID,
                type: 'text',
                readonly: false
            },
            {
                label: 'UNCW Email',
                name: CONTACT.UNCW_EMAIL,
                type: 'email',
                readonly: false
            },
            {
                label: 'Email',
                name: CONTACT.EMAIL,
                type: 'email',
                readonly: false
            },
            {
                label: 'Mobile Phone',
                name: CONTACT.MOBILE_PHONE,
                type: 'tel',
                readonly: false
            },
            {
                label: 'UNCW Employee',
                name: CONTACT.UNCW_EMPLOYEE,
                type: 'checkbox',
                readonly: false
            },
            {
                label: 'UNC System Employee',
                name: CONTACT.UNC_SYSTEM_EMPLOYEE,
                type: 'checkbox',
                readonly: false
            }
        ];
    }
}