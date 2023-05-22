import { LightningElement, api } from 'lwc';

import ACADEMIC_STANDING_HISTORY_SOBJECT from '@salesforce/schema/Academic_Standing_History__c';
import ACADEMIC_STANDING_HISTORY_NEW_ACADEMIC_STANDING from '@salesforce/schema/Academic_Standing_History__c.New_Academic_Standing__c';
import ACADEMIC_STANDING_HISTORY_OLD_ACADEMIC_STANDING from '@salesforce/schema/Academic_Standing_History__c.Old_Academic_Standing__c';
import ACADEMIC_STANDING_HISTORY_CHANGE_DATE from '@salesforce/schema/Academic_Standing_History__c.Change_Date__c';
import ACADEMIC_STANDING_HISTORY_CHANGE_REASON from '@salesforce/schema/Academic_Standing_History__c.Change_Reason__c';
import ACADEMIC_STANDING_HISTORY_CREATED_DATE from '@salesforce/schema/Academic_Standing_History__c.CreatedDate';
import ACADEMIC_STANDING_HISTORY_PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Academic_Standing_History__c.Program_Enrollment__r.Student__c';

const ACADEMIC_STANDING_HISTORY = {
    SOBJECT: ACADEMIC_STANDING_HISTORY_SOBJECT.objectApiName,
    NEW_ACADEMIC_STANDING: ACADEMIC_STANDING_HISTORY_NEW_ACADEMIC_STANDING.fieldApiName,
    OLD_ACADEMIC_STANDING: ACADEMIC_STANDING_HISTORY_OLD_ACADEMIC_STANDING.fieldApiName,
    CHANGE_DATE: ACADEMIC_STANDING_HISTORY_CHANGE_DATE.fieldApiName,
    CHANGE_REASON: ACADEMIC_STANDING_HISTORY_CHANGE_REASON.fieldApiName,
    CREATED_DATE: ACADEMIC_STANDING_HISTORY_CREATED_DATE.fieldApiName,
    PROGRAM_ENROLLMENT_STUDENT: ACADEMIC_STANDING_HISTORY_PROGRAM_ENROLLMENT_STUDENT.fieldApiName
};

export default class AcademicStadingHistoryList extends LightningElement {
    @api recordId;
    @api listSize;

    get academicStadingHistorySObject() {
        return ACADEMIC_STANDING_HISTORY.SOBJECT;
    }

    get filterBy() {
        return {
            field: ACADEMIC_STANDING_HISTORY.PROGRAM_ENROLLMENT_STUDENT,
            operator: '=',
            value: this.recordId
        };
    }

    get sortBy() {
        return {
            field: ACADEMIC_STANDING_HISTORY.CREATED_DATE,
            direction: 'desc'
        };
    }

    get fields() {
        return [
            {
                label: 'New Standing',
                name: ACADEMIC_STANDING_HISTORY.NEW_ACADEMIC_STANDING,
                type: 'text',
                readonly: true
            },
            {
                label: 'Old Standing',
                name: ACADEMIC_STANDING_HISTORY.OLD_ACADEMIC_STANDING,
                type: 'text',
                readonly: true
            },
            {
                label: 'Change Date',
                name: ACADEMIC_STANDING_HISTORY.CHANGE_DATE,
                type: 'date',
                readonly: true
            },
            {
                label: 'Change Reason',
                name: ACADEMIC_STANDING_HISTORY.CHANGE_REASON,
                type: 'textarea',
                readonly: false
            }
        ];
    }
}