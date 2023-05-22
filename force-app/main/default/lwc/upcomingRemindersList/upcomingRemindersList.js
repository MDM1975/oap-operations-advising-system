import { LightningElement } from 'lwc';
import CONTEXT_USER_ID from '@salesforce/user/Id';
import { Query } from 'c/lib';

import REMINDER_SOBJECT from '@salesforce/schema/Reminder__c';
import REMINDER_ID from '@salesforce/schema/Reminder__c.Id';
import REMINDER_SUBJECT from '@salesforce/schema/Reminder__c.Subject__c';
import REMINDER_DUE_DATE from '@salesforce/schema/Reminder__c.Due_Date__c';
import REMINDER_STATUS from '@salesforce/schema/Reminder__c.Status__c';
import REMINDER_CREATED_BY_ID from '@salesforce/schema/Reminder__c.CreatedById';

const REMINDER = {
    SOBJECT: REMINDER_SOBJECT.objectApiName,
    ID: REMINDER_ID.fieldApiName,
    SUBJECT: REMINDER_SUBJECT.fieldApiName,
    DUE_DATE: REMINDER_DUE_DATE.fieldApiName,
    STATUS: REMINDER_STATUS.fieldApiName,
    CREATED_BY_ID: REMINDER_CREATED_BY_ID.fieldApiName
};

export default class UpcomingRemindersList extends LightningElement {
    _reminders;

    get reminders() {
        return this._reminders?.map((reminder) => ({
            id: reminder[REMINDER.ID],
            subject: reminder[REMINDER.SUBJECT],
            dueDate: reminder[REMINDER.DUE_DATE]
        }));
    }

    get hasReminders() {
        return this._reminders && this._reminders?.length > 0;
    }

    async connectedCallback() {
        this._reminders = await new Query()
            .select([REMINDER.ID, REMINDER.SUBJECT, REMINDER.DUE_DATE])
            .from(REMINDER.SOBJECT)
            .where([REMINDER.STATUS, '!=', 'Completed'])
            .andWhere([REMINDER.CREATED_BY_ID, '=', CONTEXT_USER_ID])
            .orderBy([REMINDER.DUE_DATE, 'ASC'])
            .limit(3)
            .submit();
    }
}