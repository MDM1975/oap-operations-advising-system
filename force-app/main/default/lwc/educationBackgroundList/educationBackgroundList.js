import { LightningElement, api } from 'lwc';

import EDUCATIONAL_BACKGROUND_SOBJECT from '@salesforce/schema/Educational_Background__c';
import EDUCATIONAL_BACKGROUND_STUDENT from '@salesforce/schema/Educational_Background__c.Student__c';
import EDUCATIONAL_BACKGROUND_INSTITUTION_NAME from '@salesforce/schema/Educational_Background__c.Institution_Name__c';
import EDUCATIONAL_BACKGROUND_DEGREE_TYPE from '@salesforce/schema/Educational_Background__c.Degree_Type__c';
import EDUCATIONAL_BACKGROUND_EDUCATIONAL_TYPE from '@salesforce/schema/Educational_Background__c.Educational_Type__c';
import EDUCATIONAL_BACKGROUND_START_DATE from '@salesforce/schema/Educational_Background__c.Start_Date__c';
import EDUCATIONAL_BACKGROUND_END_DATE from '@salesforce/schema/Educational_Background__c.End_Date__c';

const EDUCATIONAL_BACKGROUND = {
    SOBJECT: EDUCATIONAL_BACKGROUND_SOBJECT.objectApiName,
    STUDENT: EDUCATIONAL_BACKGROUND_STUDENT.fieldApiName,
    INSTITUTION_NAME: EDUCATIONAL_BACKGROUND_INSTITUTION_NAME.fieldApiName,
    DEGREE_TYPE: EDUCATIONAL_BACKGROUND_DEGREE_TYPE.fieldApiName,
    EDUCATIONAL_TYPE: EDUCATIONAL_BACKGROUND_EDUCATIONAL_TYPE.fieldApiName,
    START_DATE: EDUCATIONAL_BACKGROUND_START_DATE.fieldApiName,
    END_DATE: EDUCATIONAL_BACKGROUND_END_DATE.fieldApiName
};

export default class EducationBackgroundList extends LightningElement {
    @api recordId;
    @api listSize;

    get educationalBackgroundSObject() {
        return EDUCATIONAL_BACKGROUND.SOBJECT;
    }

    get filterBy() {
        return {
            field: EDUCATIONAL_BACKGROUND.STUDENT,
            operator: '=',
            value: this.recordId
        };
    }

    get sortBy() {
        return {
            field: EDUCATIONAL_BACKGROUND.START_DATE,
            direction: 'desc'
        };
    }

    get studentLookup() {
        return EDUCATIONAL_BACKGROUND.STUDENT;
    }

    get fields() {
        return [
            {
                label: 'Institution Name',
                name: EDUCATIONAL_BACKGROUND.INSTITUTION_NAME,
                type: 'text',
                readonly: false,
                required: true
            },
            {
                label: 'Degree Type',
                name: EDUCATIONAL_BACKGROUND.DEGREE_TYPE,
                type: 'picklist',
                readonly: false,
                required: true,
                options: {
                    sobject: EDUCATIONAL_BACKGROUND.SOBJECT,
                    field: EDUCATIONAL_BACKGROUND.DEGREE_TYPE
                }
            },
            {
                label: 'Educational Type',
                name: EDUCATIONAL_BACKGROUND.EDUCATIONAL_TYPE,
                type: 'picklist',
                readonly: false,
                options: {
                    sobject: EDUCATIONAL_BACKGROUND.SOBJECT,
                    field: EDUCATIONAL_BACKGROUND.EDUCATIONAL_TYPE
                }
            },
            {
                label: 'Start Date',
                name: EDUCATIONAL_BACKGROUND.START_DATE,
                type: 'date',
                readonly: false
            },
            {
                label: 'End Date',
                name: EDUCATIONAL_BACKGROUND.END_DATE,
                type: 'date',
                readonly: false
            }
        ];
    }

    handleAddEducationBackground() {
        const form = this.template.querySelector('c-record-form');
        form.open();
        form.updateRecord(EDUCATIONAL_BACKGROUND.STUDENT, this.recordId);
    }

    handleSuccess() {
        this.template.querySelector('c-related-record-list').refresh();
    }
}