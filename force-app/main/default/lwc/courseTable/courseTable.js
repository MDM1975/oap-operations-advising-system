import { LightningElement } from 'lwc';
import { Query } from 'c/lib';

import COURSE_SOBJECT from '@salesforce/schema/Course__c';
import COURSE_ID from '@salesforce/schema/Course__c.Id';
import COURSE_NAME from '@salesforce/schema/Course__c.Name';
import COURSE_TITLE from '@salesforce/schema/Course__c.Course_Title__c';
import COURSE_CREDIT_HOURS from '@salesforce/schema/Course__c.Credit_Hours__c';

const COURSE = {
    SOBJECT: COURSE_SOBJECT.objectApiName,
    ID: COURSE_ID.fieldApiName,
    NAME: COURSE_NAME.fieldApiName,
    TITLE: COURSE_TITLE.fieldApiName,
    CREDIT_HOURS: COURSE_CREDIT_HOURS.fieldApiName
};

export default class CourseTable extends LightningElement {
    get courses() {
        return new Query()
            .select([COURSE.TITLE, COURSE.CREDIT_HOURS])
            .from(COURSE.SOBJECT)
            .where([COURSE.NAME, '!=', 'TBD 999'])
            .submit();
    }

    get columns() {
        return [
            {
                label: 'Course',
                name: COURSE.TITLE,
                type: 'text',
                url: {
                    page: 'course',
                    param: COURSE.ID
                }
            },
            {
                label: 'Credit Hours',
                name: COURSE.CREDIT_HOURS,
                type: 'text'
            }
        ];
    }
}