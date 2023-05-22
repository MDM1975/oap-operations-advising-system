import { LightningElement } from 'lwc';
import { Query, formatRelationshipName } from 'c/lib';

import PROGRAM_SOBJECT from '@salesforce/schema/Program__c';
import PROGRAM_ID from '@salesforce/schema/Program__c.Id';
import PROGRAM_NAME from '@salesforce/schema/Program__c.Name';
import PROGRAM_TITLE from '@salesforce/schema/Program__c.Program_Title__c';
import PROGRAM_ACTIVE from '@salesforce/schema/Program__c.Active__c';

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_ID from '@salesforce/schema/Program_Enrollment__c.Id';
import PROGRAM_ENROLLMENT_PROGRAM from '@salesforce/schema/Program_Enrollment__c.Program__c';
import PROGRAM_ENROLLMENT_ENROLLMENT_STATUS from '@salesforce/schema/Program_Enrollment__c.Enrollment_Status__c';

const PROGRAM = {
    SOBJECT: PROGRAM_SOBJECT.objectApiName,
    ID: PROGRAM_ID.fieldApiName,
    NAME: PROGRAM_NAME.fieldApiName,
    TITLE: PROGRAM_TITLE.fieldApiName,
    ACTIVE: PROGRAM_ACTIVE.fieldApiName
};

const PROGRAM_ENROLLMENT = {
    SOBJECT: formatRelationshipName({ sobject: PROGRAM_ENROLLMENT_SOBJECT.objectApiName }),
    ID: PROGRAM_ENROLLMENT_ID.fieldApiName,
    PROGRAM: PROGRAM_ENROLLMENT_PROGRAM.fieldApiName,
    ENROLLMENT_STATUS: PROGRAM_ENROLLMENT_ENROLLMENT_STATUS.fieldApiName
};

export default class ProgramList extends LightningElement {
    _programs;

    async connectedCallback() {
        this._programs = await new Query()
            .select([
                PROGRAM.ID,
                PROGRAM.NAME,
                PROGRAM.TITLE,
                new Query()
                    .select([PROGRAM_ENROLLMENT.ID])
                    .from(PROGRAM_ENROLLMENT.SOBJECT)
                    .where([PROGRAM_ENROLLMENT.ENROLLMENT_STATUS, 'NOT IN', ['Withdrawn', 'Graduated']])
            ])
            .from(PROGRAM.SOBJECT)
            .where([PROGRAM.ACTIVE, '=', true])
            .submit();
    }

    get programs() {
        return this._programs?.map((program) => ({
            id: program?.[PROGRAM.ID],
            name: program?.[PROGRAM.NAME],
            title: program?.[PROGRAM.TITLE]
        }));
    }

    get bars() {
        const enrollments = this._programs?.map((program) => program?.[PROGRAM_ENROLLMENT.SOBJECT]?.length);
        const max = Math.max(...(enrollments ?? []));
        const width = 100;
        const padding = 20;
        const height = 500;
        return enrollments?.map((enrollment, index) => ({
            index,
            x: index * (width + padding),
            y: height - (enrollment / max) * height * 0.85,
            width,
            height: (enrollment / max) * height * 0.85,
            fill: '#1a8b84',
            value: {
                x: index * (width + padding) + width / 2 - 10,
                y: Math.max(height - (enrollment / max) * height * 0.85 - 20, 15),
                text: enrollment
            }
        }));
    }

    get legends() {
        const width = 100;
        const padding = 20;
        const height = 500;
        return this._programs?.map((program, index) => {
            const text = program?.[PROGRAM.NAME];
            return {
                index,
                x: index * (width + padding) + width / 2 - (text.length * 12) / 2,
                y: height + 20,
                width,
                height: 20,
                text: text
            };
        });
    }
}