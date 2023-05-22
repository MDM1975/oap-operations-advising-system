import { LightningElement, api } from 'lwc';

import PROFESSIONAL_EXPERIENCE_SOBJECT from '@salesforce/schema/Professional_Experience__c';
import PROFESSIONAL_EXPERIENCE_COMPANY_NAME from '@salesforce/schema/Professional_Experience__c.Company_Name__c';
import PROFESSIONAL_EXPERIENCE_DESCRIPTION from '@salesforce/schema/Professional_Experience__c.Description__c';
import PROFESSIONAL_EXPERIENCE_JOB_TITLE from '@salesforce/schema/Professional_Experience__c.Job_Title__c';
import PROFESSIONAL_EXPERIENCE_STUDENT from '@salesforce/schema/Professional_Experience__c.Student__c';
import PROFESSIONAL_EXPERIENCE_START_DATE from '@salesforce/schema/Professional_Experience__c.Start_Date__c';
import PROFESSIONAL_EXPERIENCE_END_DATE from '@salesforce/schema/Professional_Experience__c.End_Date__c';

const PROFESSIONAL_EXPERIENCE = {
    SOBJECT: PROFESSIONAL_EXPERIENCE_SOBJECT.objectApiName,
    COMPANY_NAME: PROFESSIONAL_EXPERIENCE_COMPANY_NAME.fieldApiName,
    DESCRIPTION: PROFESSIONAL_EXPERIENCE_DESCRIPTION.fieldApiName,
    JOB_TITLE: PROFESSIONAL_EXPERIENCE_JOB_TITLE.fieldApiName,
    STUDENT: PROFESSIONAL_EXPERIENCE_STUDENT.fieldApiName,
    START_DATE: PROFESSIONAL_EXPERIENCE_START_DATE.fieldApiName,
    END_DATE: PROFESSIONAL_EXPERIENCE_END_DATE.fieldApiName
};

export default class ProfessionalExperienceList extends LightningElement {
    @api recordId;
    @api listSize;

    get professionalExperienceSObject() {
        return PROFESSIONAL_EXPERIENCE.SOBJECT;
    }

    get filterBy() {
        return {
            field: PROFESSIONAL_EXPERIENCE.STUDENT,
            operator: '=',
            value: this.recordId
        };
    }

    get sortBy() {
        return {
            field: PROFESSIONAL_EXPERIENCE.START_DATE,
            direction: 'desc'
        };
    }

    get fields() {
        return [
            {
                label: 'Company Name',
                name: PROFESSIONAL_EXPERIENCE.COMPANY_NAME,
                type: 'text',
                readonly: false
            },
            {
                label: 'Job Title',
                name: PROFESSIONAL_EXPERIENCE.JOB_TITLE,
                type: 'text',
                readonly: false
            },
            {
                label: 'Start Date',
                name: PROFESSIONAL_EXPERIENCE.START_DATE,
                type: 'date',
                readonly: false
            },
            {
                label: 'End Date',
                name: PROFESSIONAL_EXPERIENCE.END_DATE,
                type: 'date',
                readonly: false
            },
            {
                label: 'Description',
                name: PROFESSIONAL_EXPERIENCE.DESCRIPTION,
                type: 'textarea',
                readonly: false
            }
        ];
    }

    handleAddProfessionalExperience() {
        const form = this.template.querySelector('c-record-form');
        form.open();
        form.updateRecord(PROFESSIONAL_EXPERIENCE.STUDENT, this.recordId);
    }

    handleSuccess() {
        this.template.querySelector('c-related-record-list').refresh();
    }
}