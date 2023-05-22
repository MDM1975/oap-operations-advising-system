import { LightningElement } from 'lwc';
import CONTEXT_USER_ID from '@salesforce/user/Id';
import { Query, formatValue, Paginator } from 'c/lib';

import REMINDER_SOBJECT from '@salesforce/schema/Reminder__c';
import REMINDER_ID from '@salesforce/schema/Reminder__c.Id';
import REMINDER_SUBJECT from '@salesforce/schema/Reminder__c.Subject__c';
import REMINDER_DUE_DATE from '@salesforce/schema/Reminder__c.Due_Date__c';
import REMINDER_TYPE from '@salesforce/schema/Reminder__c.Type__c';
import REMINDER_STATUS from '@salesforce/schema/Reminder__c.Status__c';
import REMINDER_CREATED_BY_ID from '@salesforce/schema/Reminder__c.CreatedById';

const REMINDER = {
    SOBJECT: REMINDER_SOBJECT.objectApiName,
    ID: REMINDER_ID.fieldApiName,
    SUBJECT: REMINDER_SUBJECT.fieldApiName,
    DUE_DATE: REMINDER_DUE_DATE.fieldApiName,
    TYPE: REMINDER_TYPE.fieldApiName,
    STATUS: REMINDER_STATUS.fieldApiName,
    CREATED_BY_ID: REMINDER_CREATED_BY_ID.fieldApiName
};

export default class ActiveRemindersList extends LightningElement {
    _reminders;

    get reminders() {
        return new Query()
            .select([REMINDER.ID, REMINDER.SUBJECT, REMINDER.DUE_DATE, REMINDER.TYPE, REMINDER.STATUS])
            .from(REMINDER.SOBJECT)
            .where([REMINDER.CREATED_BY_ID, '=', CONTEXT_USER_ID])
            .andWhere([REMINDER.STATUS, 'NOT IN', ['Cancelled', 'Completed']])
            .orderBy([REMINDER.DUE_DATE, 'DESC'])
            .submit();
    }

    get hasReminders() {
        return this._reminders && this._reminders?.length > 0;
    }

    get activeReminders() {
        return this._reminders?.map((reminder) => ({
            id: formatValue({ field: REMINDER.ID, record: reminder }),
            subject: formatValue({ field: REMINDER.SUBJECT, record: reminder }),
            dueDate: formatValue({ field: REMINDER.DUE_DATE, record: reminder }),
            type: formatValue({ field: REMINDER.TYPE, record: reminder }),
            status: formatValue({ field: REMINDER.STATUS, record: reminder })
        }));
    }

    get hasMultiplePages() {
        return this.pageCount > 1;
    }

    get currentPage() {
        return this._paginator?.currentPage;
    }

    get pageCount() {
        return this._paginator?.totalPages;
    }

    handleJumpToStart() {
        this._reminders = this._paginator.first();
    }

    handleNext() {
        this._reminders = this._paginator.next();
    }

    handleBack() {
        this._reminders = this._paginator.previous();
    }

    handleJumpToEnd() {
        this._reminders = this._paginator.last();
    }

    handleResolved(event) {
        const { data: reminders } = event.detail;
        this._paginator = new Paginator(reminders, 3);
        this._reminders = this._paginator.next();
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }
}