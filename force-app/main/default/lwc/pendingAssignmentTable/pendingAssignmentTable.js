import { LightningElement } from 'lwc';
import { Query } from 'c/lib';
import CONTEXT_USER from '@salesforce/user/Id';

import CASE_SOBJECT from '@salesforce/schema/Case';
import CASE_ID from '@salesforce/schema/Case.Id';
import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import CASE_STATUS from '@salesforce/schema/Case.Status';
import CASE_RECORD_TYPE from '@salesforce/schema/Case.RecordTypeId';
import CASE_CREATED_DATE from '@salesforce/schema/Case.CreatedDate';
import CASE_STUDENT from '@salesforce/schema/Case.Student__c';
import CASE_STUDENT_NAME from '@salesforce/schema/Case.Student__r.Name';
import CASE_STUDENT_EMAIL from '@salesforce/schema/Case.Student__r.Email';
import CASE_STUDENT_UNIVERSITY_ID from '@salesforce/schema/Case.Student__r.University_Id__c';
import CASE_PROGRAM from '@salesforce/schema/Case.Program__c';
import CASE_PROGRAM_NAME from '@salesforce/schema/Case.Program__r.Name';

import RECORDTYPE_SOBJECT from '@salesforce/schema/RecordType';
import RECORDTYPE_ID from '@salesforce/schema/RecordType.Id';
import RECORDTYPE_NAME from '@salesforce/schema/RecordType.Name';

const RECORDTYPE = {
    SOBJECT: RECORDTYPE_SOBJECT.objectApiName,
    ID: RECORDTYPE_ID.fieldApiName,
    NAME: RECORDTYPE_NAME.fieldApiName
};

const CASE = {
    SOBJECT: CASE_SOBJECT.objectApiName,
    ID: CASE_ID.fieldApiName,
    CASE_NUMBER: CASE_NUMBER.fieldApiName,
    STATUS: CASE_STATUS.fieldApiName,
    RECORD_TYPE: CASE_RECORD_TYPE.fieldApiName,
    CREATED_DATE: CASE_CREATED_DATE.fieldApiName,
    STUDENT: CASE_STUDENT.fieldApiName,
    STUDENT_NAME: CASE_STUDENT_NAME.fieldApiName,
    PROGRAM: CASE_PROGRAM.fieldApiName,
    PROGRAM_NAME: CASE_PROGRAM_NAME.fieldApiName,
    STUDENT_EMAIL: CASE_STUDENT_EMAIL.fieldApiName,
    STUDENT_UNIVERSITY_ID: CASE_STUDENT_UNIVERSITY_ID.fieldApiName
};

export default class PendingAssignmentTable extends LightningElement {
    _isStudentOnboardingUser;

    get columns() {
        return [
            {
                label: 'Case Number',
                name: CASE.CASE_NUMBER,
                type: 'text',
                url: {
                    page: 'case',
                    param: CASE.ID
                }
            },
            {
                label: 'Student',
                name: CASE.STUDENT_NAME,
                type: 'text',
                url: {
                    page: 'student',
                    param: CASE.STUDENT
                }
            },
            {
                label: 'University ID',
                name: CASE.STUDENT_UNIVERSITY_ID,
                type: 'text'
            },
            {
                label: 'Program',
                name: CASE.PROGRAM_NAME,
                type: 'text',
                url: {
                    page: 'program',
                    param: CASE.PROGRAM
                }
            },
            {
                label: 'Email',
                name: CASE.STUDENT_EMAIL,
                type: 'text'
            },
            {
                label: 'Created Date',
                name: CASE.CREATED_DATE,
                type: 'date'
            }
        ];
    }

    get rows() {
        return new Query()
            .select([
                CASE.ID,
                CASE.CASE_NUMBER,
                CASE.CREATED_DATE,
                CASE.STUDENT_NAME,
                CASE.PROGRAM_NAME,
                CASE.STUDENT_EMAIL,
                CASE.STUDENT_UNIVERSITY_ID
            ])
            .from(CASE.SOBJECT)
            .where([
                CASE.RECORD_TYPE,
                'IN',
                new Query()
                    .select([RECORDTYPE.ID])
                    .from(RECORDTYPE.SOBJECT)
                    .where([RECORDTYPE.NAME, '=', 'Program Enrollment'])
            ])
            .andWhere([CASE.STUDENT, '!=', null])
            .andWhere([CASE.STATUS, 'NOT IN', ['Closed', 'Completed']])
            .orderBy([CASE.CREATED_DATE, 'DESC'])
            .submit();
    }

    get isStudentOnboardingUser() {
        return this._isStudentOnboardingUser && this._isStudentOnboardingUser?.length > 0;
    }

    async connectedCallback() {
        this._isStudentOnboardingUser = await new Query()
            .select(['Id'])
            .from('GroupMember')
            .where(['UserOrGroupId', '=', CONTEXT_USER])
            .andWhere(['Group.DeveloperName', '=', 'Student_Onboarding'])
            .submit();
    }
}