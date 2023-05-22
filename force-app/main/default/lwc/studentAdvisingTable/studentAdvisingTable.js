import { LightningElement } from 'lwc';
import CONTEXT_USER_ID from '@salesforce/user/Id';
import { Query } from 'c/lib';

import USER_SOBJECT from '@salesforce/schema/User';
import USER_ID from '@salesforce/schema/User.Id';
import USER_CONTACT_ID from '@salesforce/schema/User.ContactId';

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_STUDENT_ID from '@salesforce/schema/Program_Enrollment__c.Student__c';
import PROGRAM_ENROLLMENT_STUDENT_UNIVERSITY_ID from '@salesforce/schema/Program_Enrollment__c.Student__r.University_Id__c';
import PROGRAM_ENROLLMENT_STUDENT_NAME from '@salesforce/schema/Program_Enrollment__c.Student__r.Name';
import PROGRAM_ENROLLMENT_ADVISOR_ID from '@salesforce/schema/Program_Enrollment__c.Advisor__c';
import PROGRAM_ENROLLMENT_ADVISOR_NAME from '@salesforce/schema/Program_Enrollment__c.Advisor__r.Name';
import PROGRAM_ENROLLMENT_PROGRAM from '@salesforce/schema/Program_Enrollment__c.Program__c';
import PROGRAM_ENROLLMENT_PROGRAM_NAME from '@salesforce/schema/Program_Enrollment__c.Program__r.Name';
import PROGRAM_ENROLLMENT_ENROLLMENT_STATUS from '@salesforce/schema/Program_Enrollment__c.Enrollment_Status__c';
import PROGRAM_ENROLLMENT_ACADEMIC_STANDING from '@salesforce/schema/Program_Enrollment__c.Academic_Standing__c';

const USER = {
    SOBJECT: USER_SOBJECT.objectApiName,
    ID: USER_ID.fieldApiName,
    CONTACT_ID: USER_CONTACT_ID.fieldApiName
};

const PROGRAM_ENROLLMENT = {
    SOBJECT: PROGRAM_ENROLLMENT_SOBJECT.objectApiName,
    STUDENT_ID: PROGRAM_ENROLLMENT_STUDENT_ID.fieldApiName,
    UNIVERSITY_ID: PROGRAM_ENROLLMENT_STUDENT_UNIVERSITY_ID.fieldApiName,
    STUDENT_NAME: PROGRAM_ENROLLMENT_STUDENT_NAME.fieldApiName,
    ADVISOR_ID: PROGRAM_ENROLLMENT_ADVISOR_ID.fieldApiName,
    ADVISOR_NAME: PROGRAM_ENROLLMENT_ADVISOR_NAME.fieldApiName,
    PROGRAM: PROGRAM_ENROLLMENT_PROGRAM.fieldApiName,
    PROGRAM_NAME: PROGRAM_ENROLLMENT_PROGRAM_NAME.fieldApiName,
    ENROLLMENT_STATUS: PROGRAM_ENROLLMENT_ENROLLMENT_STATUS.fieldApiName,
    ACADEMIC_STANDING: PROGRAM_ENROLLMENT_ACADEMIC_STANDING.fieldApiName
};

export default class StudentAdvisingTable extends LightningElement {
    get columns() {
        return [
            {
                label: 'Student',
                name: PROGRAM_ENROLLMENT.STUDENT_NAME,
                type: 'url',
                url: {
                    page: 'student',
                    param: PROGRAM_ENROLLMENT.STUDENT_ID
                }
            },
            {
                label: 'University ID',
                name: PROGRAM_ENROLLMENT.UNIVERSITY_ID,
                type: 'text'
            },
            {
                label: 'Advisor',
                name: PROGRAM_ENROLLMENT.ADVISOR_NAME,
                type: 'text'
            },
            {
                label: 'Program',
                name: PROGRAM_ENROLLMENT.PROGRAM_NAME,
                type: 'text',
                url: {
                    page: 'program',
                    param: PROGRAM_ENROLLMENT.PROGRAM
                }
            },
            {
                label: 'Enrollment Status',
                name: PROGRAM_ENROLLMENT.ENROLLMENT_STATUS,
                type: 'text'
            },
            {
                label: 'Academic Standing',
                name: PROGRAM_ENROLLMENT.ACADEMIC_STANDING,
                type: 'text'
            }
        ];
    }

    get myStudents() {
        return new Query()
            .select([
                PROGRAM_ENROLLMENT.STUDENT_NAME,
                PROGRAM_ENROLLMENT.UNIVERSITY_ID,
                PROGRAM_ENROLLMENT.ADVISOR_NAME,
                PROGRAM_ENROLLMENT.PROGRAM_NAME,
                PROGRAM_ENROLLMENT.ENROLLMENT_STATUS,
                PROGRAM_ENROLLMENT.ACADEMIC_STANDING
            ])
            .from(PROGRAM_ENROLLMENT.SOBJECT)
            .where([PROGRAM_ENROLLMENT.ENROLLMENT_STATUS, '=', 'Enrolled'])
            .andWhere([PROGRAM_ENROLLMENT.ACADEMIC_STANDING, '!=', 'Dismissal'])
            .andWhere([
                PROGRAM_ENROLLMENT.ADVISOR_ID,
                'IN',
                new Query().select([USER.CONTACT_ID]).from(USER.SOBJECT).where([USER.ID, '=', CONTEXT_USER_ID])
            ])
            .submit();
    }

    get allStudents() {
        return new Query()
            .select([
                PROGRAM_ENROLLMENT.STUDENT_NAME,
                PROGRAM_ENROLLMENT.UNIVERSITY_ID,
                PROGRAM_ENROLLMENT.ADVISOR_NAME,
                PROGRAM_ENROLLMENT.PROGRAM_NAME,
                PROGRAM_ENROLLMENT.ENROLLMENT_STATUS,
                PROGRAM_ENROLLMENT.ACADEMIC_STANDING
            ])
            .from(PROGRAM_ENROLLMENT.SOBJECT)
            .where([PROGRAM_ENROLLMENT.ENROLLMENT_STATUS, '!=', 'Graduated'])
            .andWhere([PROGRAM_ENROLLMENT.ACADEMIC_STANDING, '!=', 'Dismissal'])
            .submit();
    }

    get graduatedStudents() {
        return new Query()
            .select([
                PROGRAM_ENROLLMENT.STUDENT_NAME,
                PROGRAM_ENROLLMENT.UNIVERSITY_ID,
                PROGRAM_ENROLLMENT.ADVISOR_NAME,
                PROGRAM_ENROLLMENT.PROGRAM_NAME,
                PROGRAM_ENROLLMENT.ENROLLMENT_STATUS,
                PROGRAM_ENROLLMENT.ACADEMIC_STANDING
            ])
            .from(PROGRAM_ENROLLMENT.SOBJECT)
            .where([PROGRAM_ENROLLMENT.ENROLLMENT_STATUS, '=', 'Graduated'])
            .submit();
    }
}