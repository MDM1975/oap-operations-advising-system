import { LightningElement, api } from 'lwc';

import COURSE_PREREQUISITE_SOBJECT from '@salesforce/schema/Course_Prerequisite__c';
import COURSE_PREREQUISITE_COURSE from '@salesforce/schema/Course_Prerequisite__c.Course__c';
import COURSE_PREREQUISITE_PREREQUISITE_COURSE_ID from '@salesforce/schema/Course_Prerequisite__c.Id';
import COURSE_PREREQUISITE_PREREQUISITE_COURSE_NAME from '@salesforce/schema/Course_Prerequisite__c.Prerequisite_Course__r.Name';
import COURSE_PREREQUISITE_PREREQUISITE_COURSE_TYPE from '@salesforce/schema/Course_Prerequisite__c.Type__c';

const COURSE_PREREQUISITE = {
    SOBJECT: COURSE_PREREQUISITE_SOBJECT.objectApiName,
    COURSE: COURSE_PREREQUISITE_COURSE.fieldApiName,
    PREREQUISITE_COURSE_ID: COURSE_PREREQUISITE_PREREQUISITE_COURSE_ID.fieldApiName,
    PREREQUISITE_COURSE_NAME: COURSE_PREREQUISITE_PREREQUISITE_COURSE_NAME.fieldApiName,
    PREREQUISITE_COURSE_TYPE: COURSE_PREREQUISITE_PREREQUISITE_COURSE_TYPE.fieldApiName
};

export default class PrerequisiteCourseList extends LightningElement {
    @api recordId;

    get coursePrerequisiteSObject() {
        return COURSE_PREREQUISITE.SOBJECT;
    }

    get filterBy() {
        return {
            field: COURSE_PREREQUISITE.COURSE,
            operator: '=',
            value: this.recordId
        };
    }

    get fields() {
        return [
            {
                label: 'Course',
                name: COURSE_PREREQUISITE.PREREQUISITE_COURSE_NAME,
                type: 'text',
                readonly: true
            },
            {
                label: 'Type',
                name: COURSE_PREREQUISITE.PREREQUISITE_COURSE_TYPE,
                type: 'text',
                readonly: true
            }
        ];
    }
}