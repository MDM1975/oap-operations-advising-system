import { LightningElement, api } from 'lwc';

import COURSE_SOBJECT from '@salesforce/schema/Course__c';
import COURSE_ID from '@salesforce/schema/Course__c.Id';
import COURSE_TITLE from '@salesforce/schema/Course__c.Course_Title__c';
import COURSE_CREDIT_HOURS from '@salesforce/schema/Course__c.Credit_Hours__c';

const COURSE = {
    SOBJECT: COURSE_SOBJECT.objectApiName,
    ID: COURSE_ID.fieldApiName,
    TITLE: COURSE_TITLE.fieldApiName,
    CREDIT_HOURS: COURSE_CREDIT_HOURS.fieldApiName
};

export default class CourseDetailCard extends LightningElement {
    @api recordId;

    get courseSObject() {
        return COURSE.SOBJECT;
    }

    get filterBy() {
        return {
            field: COURSE.ID,
            operator: '=',
            value: this.recordId
        };
    }

    get fields() {
        return [
            {
                label: 'Course Title',
                name: COURSE.TITLE,
                type: 'text',
                readonly: true
            },
            {
                label: 'Credit Hours',
                name: COURSE.CREDIT_HOURS,
                type: 'number',
                readonly: true
            }
        ];
    }
}