import { LightningElement, api } from 'lwc';

import REMINDER_SOBJECT from '@salesforce/schema/Reminder__c';
import REMINDER_ID from '@salesforce/schema/Reminder__c.Id';
import REMINDER_SUBJECT from '@salesforce/schema/Reminder__c.Subject__c';
import REMINDER_DESCRIPTION from '@salesforce/schema/Reminder__c.Description__c';
import REMINDER_DUE_DATE from '@salesforce/schema/Reminder__c.Due_Date__c';
import REMINDER_PRIORITY from '@salesforce/schema/Reminder__c.Priority__c';
import REMINDER_TYPE from '@salesforce/schema/Reminder__c.Type__c';
import REMINDER_STATUS from '@salesforce/schema/Reminder__c.Status__c';

const REMINDER = {
    SOBJECT: REMINDER_SOBJECT.objectApiName,
    ID: REMINDER_ID.fieldApiName,
    SUBJECT: REMINDER_SUBJECT.fieldApiName,
    DESCRIPTION: REMINDER_DESCRIPTION.fieldApiName,
    DUE_DATE: REMINDER_DUE_DATE.fieldApiName,
    PRIORITY: REMINDER_PRIORITY.fieldApiName,
    TYPE: REMINDER_TYPE.fieldApiName,
    STATUS: REMINDER_STATUS.fieldApiName
};

export default class ReminderDetailCard extends LightningElement {
    @api recordId;

    get reminderSObject() {
        return REMINDER.SOBJECT;
    }

    get filterBy() {
        return {
            field: REMINDER.ID,
            operator: '=',
            value: this.recordId
        };
    }

    get fields() {
        return [
            {
                label: 'Subject',
                name: REMINDER.SUBJECT,
                type: 'text',
                readonly: false
            },
            {
                label: 'Type',
                name: REMINDER.TYPE,
                type: 'picklist',
                readonly: true
            },
            {
                label: 'Status',
                name: REMINDER.STATUS,
                type: 'picklist',
                readonly: false,
                options: {
                    sobject: REMINDER.SOBJECT,
                    field: REMINDER.STATUS
                }
            },
            {
                label: 'Due Date',
                name: REMINDER.DUE_DATE,
                type: 'date',
                readonly: false
            },
            {
                label: 'Priority',
                name: REMINDER.PRIORITY,
                type: 'picklist',
                readonly: false,
                options: {
                    sobject: REMINDER.SOBJECT,
                    field: REMINDER.PRIORITY
                }
            },
            {
                label: 'Description',
                name: REMINDER.DESCRIPTION,
                type: 'textarea',
                readonly: false
            }
        ];
    }
}