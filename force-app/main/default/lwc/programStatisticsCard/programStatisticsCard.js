import { LightningElement, api } from 'lwc';
import { Query, formatRelationshipName } from 'c/lib';

import PROGRAM_SOBJECT from '@salesforce/schema/Program__c';
import PROGRAM_ID from '@salesforce/schema/Program__c.Id';

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_ID from '@salesforce/schema/Program_Enrollment__c.Id';
import PROGRAM_ENROLLMENT_PROGRAM from '@salesforce/schema/Program_Enrollment__c.Program__c';
import PROGRAM_ENROLLMENT_ENROLLMENT_STATUS from '@salesforce/schema/Program_Enrollment__c.Enrollment_Status__c';

import CONCENTRATION_SOBJECT from '@salesforce/schema/Concentration__c';
import CONCENTRATION_ID from '@salesforce/schema/Concentration__c.Id';
import CONCENTRATION_PROGRAM from '@salesforce/schema/Concentration__c.Program__c';

const PROGRAM = {
    SOBJECT: PROGRAM_SOBJECT.objectApiName,
    ID: PROGRAM_ID.fieldApiName
};

const PROGRAM_ENROLLMENT = {
    SOBJECT: formatRelationshipName({ sobject: PROGRAM_ENROLLMENT_SOBJECT.objectApiName }),
    ID: PROGRAM_ENROLLMENT_ID.fieldApiName,
    PROGRAM: PROGRAM_ENROLLMENT_PROGRAM.fieldApiName,
    ENROLLMENT_STATUS: PROGRAM_ENROLLMENT_ENROLLMENT_STATUS.fieldApiName
};

const CONCENTRATION = {
    SOBJECT: formatRelationshipName({ sobject: CONCENTRATION_SOBJECT.objectApiName }),
    ID: CONCENTRATION_ID.fieldApiName,
    PROGRAM: CONCENTRATION_PROGRAM.fieldApiName
};

export default class ProgramStatisticsCard extends LightningElement {
    @api recordId;
    _program;

    get program() {
        return {
            enrollments: this._program?.[PROGRAM_ENROLLMENT.SOBJECT]?.length ?? 0,
            concentrations: this._program?.[CONCENTRATION.SOBJECT]?.length ?? 0
        };
    }

    async connectedCallback() {
        const [program] = await new Query()
            .select([
                new Query()
                    .select([PROGRAM_ENROLLMENT.ID])
                    .from(PROGRAM_ENROLLMENT.SOBJECT)
                    .where([PROGRAM_ENROLLMENT.ENROLLMENT_STATUS, 'NOT IN', ['Withdrawn', 'Graduated']]),
                new Query().select([CONCENTRATION.ID]).from(CONCENTRATION.SOBJECT)
            ])
            .from(PROGRAM.SOBJECT)
            .where([PROGRAM.ID, '=', this.recordId])
            .submit();

        this._program = program;
    }
}