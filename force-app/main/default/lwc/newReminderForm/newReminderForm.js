import { LightningElement, api } from 'lwc';

import REMINDER_SOBJECT from '@salesforce/schema/Reminder__c';
import REMINDER_SUBJECT from '@salesforce/schema/Reminder__c.Subject__c';
import REMINDER_DESCRIPTION from '@salesforce/schema/Reminder__c.Description__c';
import REMINDER_DUE_DATE from '@salesforce/schema/Reminder__c.Due_Date__c';
import REMINDER_PRIORITY from '@salesforce/schema/Reminder__c.Priority__c';
import REMINDER_TYPE from '@salesforce/schema/Reminder__c.Type__c';

const REMINDER = {
    SOBJECT: REMINDER_SOBJECT.objectApiName,
    SUBJECT: REMINDER_SUBJECT.fieldApiName,
    DESCRIPTION: REMINDER_DESCRIPTION.fieldApiName,
    DUE_DATE: REMINDER_DUE_DATE.fieldApiName,
    PRIORITY: REMINDER_PRIORITY.fieldApiName,
    TYPE: REMINDER_TYPE.fieldApiName
};

export default class NewReminderForm extends LightningElement {
    get reminderSObject() {
        return REMINDER.SOBJECT;
    }

    get fields() {
        return [
            {
                label: 'Subject',
                name: REMINDER.SUBJECT,
                type: 'text',
                maxlength: 65,
                required: true
            },
            {
                label: 'Type',
                name: REMINDER.TYPE,
                type: 'picklist',
                required: true,
                options: {
                    sobject: REMINDER.SOBJECT,
                    field: REMINDER.TYPE
                }
            },
            {
                label: 'Due Date',
                name: REMINDER.DUE_DATE,
                type: 'date',
                required: true
            },
            {
                label: 'Priority',
                name: REMINDER.PRIORITY,
                type: 'picklist',
                required: true,
                options: {
                    sobject: REMINDER.SOBJECT,
                    field: REMINDER.PRIORITY
                }
            },
            {
                label: 'Description',
                name: REMINDER.DESCRIPTION,
                type: 'textarea',
                maxlength: 255,
                required: false
            }
        ];
    }

    @api open() {
        this.template.querySelector('c-record-form').open();
    }

    handleSuccess(event) {
        const { id: reminderId } = event.detail;
        this.template.querySelector('c-record-form').navigate(reminderId);
    }
}