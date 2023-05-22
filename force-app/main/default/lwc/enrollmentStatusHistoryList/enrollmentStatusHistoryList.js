import { LightningElement, api } from 'lwc';

import ENROLLMENT_STATUS_HISTORY_SOBJECT from '@salesforce/schema/Enrollment_Status_History__c';
import ENROLLMENT_STATUS_HISTORY_NEW_ENROLLMENT_STATUS from '@salesforce/schema/Enrollment_Status_History__c.New_Enrollment_Status__c';
import ENROLLMENT_STATUS_HISTORY_OLD_ENROLLMENT_STATUS from '@salesforce/schema/Enrollment_Status_History__c.Old_Enrollment_Status__c';
import ENROLLMENT_STATUS_HISTORY_CHANGE_DATE from '@salesforce/schema/Enrollment_Status_History__c.Change_Date__c';
import ENROLLMENT_STATUS_HISTORY_CHANGE_REASON from '@salesforce/schema/Enrollment_Status_History__c.Change_Reason__c';
import ENROLLMENT_STATUS_HISTORY_CREATED_DATE from '@salesforce/schema/Enrollment_Status_History__c.CreatedDate';
import ENROLLMENT_STATUS_HISTORY_PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Enrollment_Status_History__c.Program_Enrollment__r.Student__c';

const ENROLLMENT_STATUS_HISTORY = {
    SOBJECT: ENROLLMENT_STATUS_HISTORY_SOBJECT.objectApiName,
    NEW_ENROLLMENT_STATUS: ENROLLMENT_STATUS_HISTORY_NEW_ENROLLMENT_STATUS.fieldApiName,
    OLD_ENROLLMENT_STATUS: ENROLLMENT_STATUS_HISTORY_OLD_ENROLLMENT_STATUS.fieldApiName,
    CHANGE_DATE: ENROLLMENT_STATUS_HISTORY_CHANGE_DATE.fieldApiName,
    CHANGE_REASON: ENROLLMENT_STATUS_HISTORY_CHANGE_REASON.fieldApiName,
    CREATED_DATE: ENROLLMENT_STATUS_HISTORY_CREATED_DATE.fieldApiName,
    PROGRAM_ENROLLMENT_STUDENT: ENROLLMENT_STATUS_HISTORY_PROGRAM_ENROLLMENT_STUDENT.fieldApiName
};

export default class EnrollmentStatusHistoryList extends LightningElement {
    @api recordId;
    @api listSize;

    get enrollmentStatusHistorySObject() {
        return ENROLLMENT_STATUS_HISTORY_SOBJECT.objectApiName;
    }

    get filterBy() {
        return {
            field: ENROLLMENT_STATUS_HISTORY.PROGRAM_ENROLLMENT_STUDENT,
            operator: '=',
            value: this.recordId
        };
    }

    get sortBy() {
        return {
            field: ENROLLMENT_STATUS_HISTORY.CREATED_DATE,
            direction: 'desc'
        };
    }

    get fields() {
        return [
            {
                label: 'New Status',
                name: ENROLLMENT_STATUS_HISTORY.NEW_ENROLLMENT_STATUS,
                type: 'text',
                readonly: true
            },
            {
                label: 'Old Status',
                name: ENROLLMENT_STATUS_HISTORY.OLD_ENROLLMENT_STATUS,
                type: 'text',
                readonly: true
            },
            {
                label: 'Change Date',
                name: ENROLLMENT_STATUS_HISTORY.CHANGE_DATE,
                type: 'date',
                readonly: true
            },
            {
                label: 'Change Reason',
                name: ENROLLMENT_STATUS_HISTORY.CHANGE_REASON,
                type: 'textarea',
                readonly: false
            }
        ];
    }
}