import { LightningElement, api } from 'lwc';
import { Query } from 'c/lib';

import CONCENTRATION_SOBJECT from '@salesforce/schema/Concentration__c';
import CONCENTRATION_ID from '@salesforce/schema/Concentration__c.Id';
import CONCENTRATION_NAME from '@salesforce/schema/Concentration__c.Name';
import CONCENTRATION_PROGRAM from '@salesforce/schema/Concentration__c.Program__c';

const CONCENTRATION = {
    SOBJECT: CONCENTRATION_SOBJECT.objectApiName,
    ID: CONCENTRATION_ID.fieldApiName,
    NAME: CONCENTRATION_NAME.fieldApiName,
    PROGRAM: CONCENTRATION_PROGRAM.fieldApiName
};

export default class ProgramConcentrationsList extends LightningElement {
    @api recordId;
    _concentrations;

    get hasConcentrations() {
        return this.concentrations && this.concentrations?.length > 0;
    }

    get concentrations() {
        return this._concentrations?.map((concentration) => ({
            id: concentration?.[CONCENTRATION.ID],
            name: concentration?.[CONCENTRATION.NAME]
        }));
    }

    async connectedCallback() {
        this._concentrations = await new Query()
            .select([CONCENTRATION.ID, CONCENTRATION.NAME])
            .from(CONCENTRATION.SOBJECT)
            .where([CONCENTRATION.PROGRAM, '=', this.recordId])
            .submit();
    }
}