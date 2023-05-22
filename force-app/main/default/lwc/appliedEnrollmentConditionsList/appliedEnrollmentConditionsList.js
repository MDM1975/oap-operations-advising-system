import { LightningElement, api } from 'lwc';

import APPLIED_ENROLLMENT_CONDITION_SOBJECT from '@salesforce/schema/Applied_Enrollment_Condition__c';
import APPLIED_ENROLLMENT_CONDITION_ID from '@salesforce/schema/Applied_Enrollment_Condition__c.Id';
import APPLIED_ENROLLMENT_CONDITION_PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Applied_Enrollment_Condition__c.Program_Enrollment__r.Student__c';
import APPLIED_ENROLLMENT_CONDITION_DESCRIPTION from '@salesforce/schema/Applied_Enrollment_Condition__c.Enrollment_Condition__r.Description__c';

const APPLIED_ENROLLMENT_CONDITION = {
    SOBJECT: APPLIED_ENROLLMENT_CONDITION_SOBJECT.objectApiName,
    ID: APPLIED_ENROLLMENT_CONDITION_ID.fieldApiName,
    PROGRAM_ENROLLMENT_STUDENT: APPLIED_ENROLLMENT_CONDITION_PROGRAM_ENROLLMENT_STUDENT.fieldApiName,
    DESCRIPTION: APPLIED_ENROLLMENT_CONDITION_DESCRIPTION.fieldApiName
};

export default class AppliedEnrollmentConditionsList extends LightningElement {
    @api recordId;
    @api listSize;

    get appliedEnrollmentConditionSObject() {
        return APPLIED_ENROLLMENT_CONDITION.SOBJECT;
    }

    get filterBy() {
        return {
            field: APPLIED_ENROLLMENT_CONDITION.PROGRAM_ENROLLMENT_STUDENT,
            operator: '=',
            value: this.recordId
        };
    }

    get fields() {
        return [
            {
                label: 'Description',
                name: APPLIED_ENROLLMENT_CONDITION.DESCRIPTION,
                type: 'text',
                readonly: true
            }
        ];
    }
}