import { LightningElement } from 'lwc';
import { Query } from 'c/lib';
import CONTEXT_USER from '@salesforce/user/Id';

import CONTACT_SOBJECT from '@salesforce/schema/Contact';
import CONTACT_ID from '@salesforce/schema/Contact.Id';
import CONTACT_RECORDTYPE_NAME from '@salesforce/schema/Contact.RecordType.Name';

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_ID from '@salesforce/schema/Program_Enrollment__c.Id';
import PROGRAM_ENROLLMENT_ADVISOR from '@salesforce/schema/Program_Enrollment__c.Advisor__c';
import PROGRAM_ENROLLMENT_ADVISOR_NAME from '@salesforce/schema/Program_Enrollment__c.Advisor__r.Name';
import PROGRAM_ENROLLMENT_STATUS from '@salesforce/schema/Program_Enrollment__c.Enrollment_Status__c';

const CONTACT = {
    SOBJECT: CONTACT_SOBJECT.objectApiName,
    ID: CONTACT_ID.fieldApiName,
    RECORDTYPE_NAME: CONTACT_RECORDTYPE_NAME.fieldApiName
};

const PROGRAM_ENROLLMENT = {
    SOBJECT: PROGRAM_ENROLLMENT_SOBJECT.objectApiName,
    ID: PROGRAM_ENROLLMENT_ID.fieldApiName,
    ADVISOR: PROGRAM_ENROLLMENT_ADVISOR.fieldApiName,
    ADVISOR_NAME: PROGRAM_ENROLLMENT_ADVISOR_NAME.fieldApiName,
    STATUS: PROGRAM_ENROLLMENT_STATUS.fieldApiName
};

export default class AdvisorAssignmentCountCard extends LightningElement {
    _advisors;
    _isStudentOnboardingUser;

    get advisors() {
        return this._advisors
            ?.map((advisor) => ({
                name: advisor.Name,
                assignments: advisor.assignments
            }))
            .sort((a, b) => b.assignments - a.assignments);
    }

    get isStudentOnboardingUser() {
        return this._isStudentOnboardingUser && this._isStudentOnboardingUser?.length > 0;
    }

    async connectedCallback() {
        this._advisors = await new Query()
            .select([`COUNT(${PROGRAM_ENROLLMENT.ID}) assignments`, `${PROGRAM_ENROLLMENT.ADVISOR_NAME}`])
            .from(PROGRAM_ENROLLMENT.SOBJECT)
            .where([
                PROGRAM_ENROLLMENT.ADVISOR,
                'IN',
                new Query().select([CONTACT.ID]).from(CONTACT.SOBJECT).where([CONTACT.RECORDTYPE_NAME, '=', 'Advisor'])
            ])
            .andWhere([PROGRAM_ENROLLMENT.STATUS, '=', 'Enrolled'])
            .groupBy([PROGRAM_ENROLLMENT.ADVISOR_NAME])
            .submit();

        this._isStudentOnboardingUser = await new Query()
            .select(['Id'])
            .from('GroupMember')
            .where(['UserOrGroupId', '=', CONTEXT_USER])
            .andWhere(['Group.DeveloperName', '=', 'Student_Onboarding'])
            .submit();
    }
}