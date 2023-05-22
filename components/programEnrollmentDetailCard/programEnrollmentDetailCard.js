import { LightningElement, api } from 'lwc';
import { Query } from 'c/lib';

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_ID from '@salesforce/schema/Program_Enrollment__c.Id';
import PROGRAM_ENROLLMENT_STUDENT_ID from '@salesforce/schema/Program_Enrollment__c.Student__c';
import PROGRAM_ENROLLMENT_STUDENT_NAME from '@salesforce/schema/Program_Enrollment__c.Student__r.Name';
import PROGRAM_ENROLLMENT_PROGRAM_ID from '@salesforce/schema/Program_Enrollment__c.Program__c';
import PROGRAM_ENROLLMENT_PROGRAM_NAME from '@salesforce/schema/Program_Enrollment__c.Program__r.Name';
import PROGRAM_ENROLLMENT_COURSE_CATALOG_ID from '@salesforce/schema/Program_Enrollment__c.Course_Catalog__c';
import PROGRAM_ENROLLMENT_COURSE_CATALOG_TITLE from '@salesforce/schema/Program_Enrollment__c.Course_Catalog__r.Course_Catalog_Title__c';
import PROGRAM_ENROLLMENT_ACADEMIC_STANDING from '@salesforce/schema/Program_Enrollment__c.Academic_Standing__c';
import PROGRAM_ENROLLMENT_ENROLLMENT_STATUS from '@salesforce/schema/Program_Enrollment__c.Enrollment_Status__c';
import PROGRAM_ENROLLMENT_ENTRY_SEMESTER_NAME from '@salesforce/schema/Program_Enrollment__c.Entry_Semester__r.Name';
import PROGRAM_ENROLLMENT_PROJECTED_GRADUATION_SEMESTER_ID from '@salesforce/schema/Program_Enrollment__c.Projected_Graduation_Semester__c';
import PROGRAM_ENROLLMENT_PROJECTED_GRADUATION_SEMESTER_NAME from '@salesforce/schema/Program_Enrollment__c.Projected_Graduation_Semester__r.Name';
import PROGRAM_ENROLLMENT_ACTUAL_GRADUATION_SEMESTER_ID from '@salesforce/schema/Program_Enrollment__c.Actual_Graduation_Semester__c';
import PROGRAM_ENROLLMENT_ACTUAL_GRADUATION_SEMESTER_NAME from '@salesforce/schema/Program_Enrollment__c.Actual_Graduation_Semester__r.Name';
import PROGRAM_ENROLLMENT_CREATED_DATE from '@salesforce/schema/Program_Enrollment__c.CreatedDate';
import PROGRAM_ENROLLMENT_LAST_MODIFIED_DATE from '@salesforce/schema/Program_Enrollment__c.LastModifiedDate';

import COURSE_CATALOG_SOBJECT from '@salesforce/schema/Course_Catalog__c';
import COURSE_CATALOG_ID from '@salesforce/schema/Course_Catalog__c.Id';
import COURSE_CATALOG_TITLE from '@salesforce/schema/Course_Catalog__c.Course_Catalog_Title__c';
import COURSE_CATALOG_PROGRAM_ID from '@salesforce/schema/Course_Catalog__c.Program__c';

import SEMESTER_SOBJECT from '@salesforce/schema/Semester__c';
import SEMESTER_ID from '@salesforce/schema/Semester__c.Id';
import SEMESTER_NAME from '@salesforce/schema/Semester__c.Name';
import SEMESTER_ACADEMIC_YEAR from '@salesforce/schema/Semester__c.Academic_Year__c';

const PROGRAM_ENROLLMENT = {
    SOBJECT: PROGRAM_ENROLLMENT_SOBJECT.objectApiName,
    ID: PROGRAM_ENROLLMENT_ID.fieldApiName,
    STUDENT_ID: PROGRAM_ENROLLMENT_STUDENT_ID.fieldApiName,
    STUDENT: PROGRAM_ENROLLMENT_STUDENT_NAME.fieldApiName,
    PROGRAM_ID: PROGRAM_ENROLLMENT_PROGRAM_ID.fieldApiName,
    PROGRAM: PROGRAM_ENROLLMENT_PROGRAM_NAME.fieldApiName,
    COURSE_CATALOG_ID: PROGRAM_ENROLLMENT_COURSE_CATALOG_ID.fieldApiName,
    COURSE_CATALOG: PROGRAM_ENROLLMENT_COURSE_CATALOG_TITLE.fieldApiName,
    ACADEMIC_STANDING: PROGRAM_ENROLLMENT_ACADEMIC_STANDING.fieldApiName,
    ENROLLMENT_STATUS: PROGRAM_ENROLLMENT_ENROLLMENT_STATUS.fieldApiName,
    ENTRY_SEMESTER: PROGRAM_ENROLLMENT_ENTRY_SEMESTER_NAME.fieldApiName,
    PROJECTED_GRADUATION_SEMESTER_ID: PROGRAM_ENROLLMENT_PROJECTED_GRADUATION_SEMESTER_ID.fieldApiName,
    PROJECTED_GRADUATION_SEMESTER: PROGRAM_ENROLLMENT_PROJECTED_GRADUATION_SEMESTER_NAME.fieldApiName,
    ACTUAL_GRADUATION_SEMESTER_ID: PROGRAM_ENROLLMENT_ACTUAL_GRADUATION_SEMESTER_ID.fieldApiName,
    ACTUAL_GRADUATION_SEMESTER: PROGRAM_ENROLLMENT_ACTUAL_GRADUATION_SEMESTER_NAME.fieldApiName,
    CREATED_DATE: PROGRAM_ENROLLMENT_CREATED_DATE.fieldApiName,
    LAST_MODIFIED_DATE: PROGRAM_ENROLLMENT_LAST_MODIFIED_DATE.fieldApiName
};

const COURSE_CATALOG = {
    SOBJECT: COURSE_CATALOG_SOBJECT.objectApiName,
    ID: COURSE_CATALOG_ID.fieldApiName,
    TITLE: COURSE_CATALOG_TITLE.fieldApiName,
    PROGRAM_ID: COURSE_CATALOG_PROGRAM_ID.fieldApiName
};

const SEMESTER = {
    SOBJECT: SEMESTER_SOBJECT.objectApiName,
    ID: SEMESTER_ID.fieldApiName,
    NAME: SEMESTER_NAME.fieldApiName,
    ACADEMIC_YEAR: SEMESTER_ACADEMIC_YEAR.fieldApiName
};

export default class ProgramEnrollmentDetailCard extends LightningElement {
    @api recordId;

    get programEnrollmentSObject() {
        return PROGRAM_ENROLLMENT.SOBJECT;
    }

    get filterBy() {
        return {
            field: PROGRAM_ENROLLMENT.STUDENT_ID,
            operator: '=',
            value: this.recordId
        };
    }

    get fields() {
        return [
            {
                label: 'Program',
                name: PROGRAM_ENROLLMENT.PROGRAM,
                readonly: true,
                url: {
                    page: 'program',
                    param: PROGRAM_ENROLLMENT.PROGRAM_ID
                }
            },
            {
                label: 'Course Catalog',
                name: PROGRAM_ENROLLMENT.COURSE_CATALOG,
                type: 'lookup',
                readonly: false,
                options: {
                    query: new Query()
                        .select([COURSE_CATALOG.ID, COURSE_CATALOG.TITLE])
                        .from(COURSE_CATALOG.SOBJECT)
                        .where([
                            COURSE_CATALOG.PROGRAM_ID,
                            'IN',
                            new Query()
                                .select([PROGRAM_ENROLLMENT.PROGRAM_ID])
                                .from(PROGRAM_ENROLLMENT.SOBJECT)
                                .where([PROGRAM_ENROLLMENT.STUDENT_ID, '=', this.recordId])
                        ]),
                    label: COURSE_CATALOG.TITLE,
                    value: COURSE_CATALOG.ID
                }
            },
            {
                label: 'Academic Standing',
                name: PROGRAM_ENROLLMENT.ACADEMIC_STANDING,
                type: 'picklist',
                readonly: false,
                options: {
                    sobject: PROGRAM_ENROLLMENT.SOBJECT,
                    field: PROGRAM_ENROLLMENT.ACADEMIC_STANDING
                }
            },
            {
                label: 'Enrollment Status',
                name: PROGRAM_ENROLLMENT.ENROLLMENT_STATUS,
                type: 'picklist',
                readonly: false,
                options: {
                    sobject: PROGRAM_ENROLLMENT.SOBJECT,
                    field: PROGRAM_ENROLLMENT.ENROLLMENT_STATUS
                }
            },
            {
                label: 'Entry Semester',
                name: PROGRAM_ENROLLMENT.ENTRY_SEMESTER,
                readonly: true
            },
            {
                label: 'Projected Graduation Semester',
                name: PROGRAM_ENROLLMENT.PROJECTED_GRADUATION_SEMESTER,
                type: 'lookup',
                readonly: false,
                options: {
                    query: new Query()
                        .select([SEMESTER.ID, SEMESTER.NAME])
                        .from(SEMESTER.SOBJECT)
                        .where([SEMESTER.ACADEMIC_YEAR, '>=', `${new Date().getFullYear()}`])
                        .andWhere([SEMESTER.ACADEMIC_YEAR, '<=', `${new Date().getFullYear() + 2}`])
                        .orderBy([SEMESTER.ACADEMIC_YEAR, 'ASC'], [SEMESTER.NAME, 'ASC']),
                    label: SEMESTER.NAME,
                    value: SEMESTER.ID
                }
            },
            {
                label: 'Actual Graduation Semester',
                name: PROGRAM_ENROLLMENT.ACTUAL_GRADUATION_SEMESTER,
                type: 'lookup',
                readonly: false,
                options: {
                    query: new Query()
                        .select([SEMESTER.ID, SEMESTER.NAME])
                        .from(SEMESTER.SOBJECT)
                        .where([SEMESTER.ACADEMIC_YEAR, '>=', `${new Date().getFullYear()}`])
                        .andWhere([SEMESTER.ACADEMIC_YEAR, '<=', `${new Date().getFullYear() + 2}`])
                        .orderBy([SEMESTER.ACADEMIC_YEAR, 'ASC'], [SEMESTER.NAME, 'ASC']),
                    label: SEMESTER.NAME,
                    value: SEMESTER.ID
                }
            },
            {
                label: 'Last Modified Date',
                name: PROGRAM_ENROLLMENT.LAST_MODIFIED_DATE,
                type: 'date',
                readonly: true
            }
        ];
    }
}