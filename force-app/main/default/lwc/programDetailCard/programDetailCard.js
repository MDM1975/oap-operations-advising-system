import { LightningElement, api } from 'lwc';

import PROGRAM_SOBJECT from '@salesforce/schema/Program__c';
import PROGRAM_ID from '@salesforce/schema/Program__c.Id';
import PROGRAM_NAME from '@salesforce/schema/Program__c.Name';
import PROGRAM_TITLE from '@salesforce/schema/Program__c.Program_Title__c';

const PROGRAM = {
    SOBJECT: PROGRAM_SOBJECT.objectApiName,
    ID: PROGRAM_ID.fieldApiName,
    NAME: PROGRAM_NAME.fieldApiName,
    TITLE: PROGRAM_TITLE.fieldApiName
};

export default class ProgramDetailCard extends LightningElement {
    @api recordId;

    get programSObject() {
        return PROGRAM.SOBJECT;
    }

    get filterBy() {
        return {
            field: PROGRAM.ID,
            operator: '=',
            value: this.recordId
        };
    }

    get fields() {
        return [
            {
                label: 'Name',
                name: PROGRAM.NAME,
                type: 'text',
                readonly: true
            },
            {
                label: 'Title',
                name: PROGRAM.TITLE,
                type: 'text',
                readonly: true
            }
        ];
    }
}