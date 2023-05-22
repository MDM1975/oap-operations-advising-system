import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { Query, RecordProxy, RecordProxyCollection, formatValue } from 'c/lib';
import sendWelcomeEmail from '@salesforce/apex/WelcomeEmailController.sendWelcomeEmail';

import PROGRAM_ENROLLMENT_SOBJECT from '@salesforce/schema/Program_Enrollment__c';
import PROGRAM_ENROLLMENT_STUDENT from '@salesforce/schema/Program_Enrollment__c.Student__c';
import PROGRAM_ENROLLMENT_ADVISOR from '@salesforce/schema/Program_Enrollment__c.Advisor__c';
import PROGRAM_ENROLLMENT_ENTRY_SEMESTER from '@salesforce/schema/Program_Enrollment__c.Entry_Semester__c';
import PROGRAM_ENROLLMENT_PROGRAM from '@salesforce/schema/Program_Enrollment__c.Program__c';

import APPLIED_ENROLLMENT_CONDITION_SOBJECT from '@salesforce/schema/Applied_Enrollment_Condition__c';
import APPLIED_ENROLLMENT_CONDITION_ENROLLMENT_CONDITION from '@salesforce/schema/Applied_Enrollment_Condition__c.Enrollment_Condition__c';
import APPLIED_ENROLLMENT_CONDITION_PROGRAM_ENROLLMENT from '@salesforce/schema/Applied_Enrollment_Condition__c.Program_Enrollment__c';

import CONTACT_SOBJECT from '@salesforce/schema/Contact';
import CONTACT_ID from '@salesforce/schema/Contact.Id';
import CONTACT_NAME from '@salesforce/schema/Contact.Name';
import IS_ACTIVE from '@salesforce/schema/Contact.Is_Active__c';
import CONATCT_RECORDTYPE_NAME from '@salesforce/schema/Contact.RecordType.Name';

import SEMESTER_SOBJECT from '@salesforce/schema/Semester__c';
import SEMESTER_ID from '@salesforce/schema/Semester__c.Id';
import SEMESTER_NAME from '@salesforce/schema/Semester__c.Name';
import SEMESTER_START_DATE from '@salesforce/schema/Semester__c.Start_Date__c';

import PROGRAM_SOBJECT from '@salesforce/schema/Program__c';
import PROGRAM_ID from '@salesforce/schema/Program__c.Id';
import PROGRAM_NAME from '@salesforce/schema/Program__c.Name';
import PROGRAM_ACTIVE from '@salesforce/schema/Program__c.Active__c';

import ENROLLMENT_CONDITION_SOBJECT from '@salesforce/schema/Enrollment_Condition__c';
import ENROLLMENT_CONDITION_ID from '@salesforce/schema/Enrollment_Condition__c.Id';
import ENROLLMENT_CONDITION_DESCRIPTION from '@salesforce/schema/Enrollment_Condition__c.Description__c';

import CASE_SOBJECT from '@salesforce/schema/Case';
import CASE_ID from '@salesforce/schema/Case.Id';
import CASE_STUDENT from '@salesforce/schema/Case.Student__c';
import CASE_STUDENT_NAME from '@salesforce/schema/Case.Student__r.Name';

const PROGRAM_ENROLLMENT = {
    SOBJECT: PROGRAM_ENROLLMENT_SOBJECT.objectApiName,
    STUDENT: PROGRAM_ENROLLMENT_STUDENT.fieldApiName,
    ADVISOR: PROGRAM_ENROLLMENT_ADVISOR.fieldApiName,
    ENTRY_SEMESTER: PROGRAM_ENROLLMENT_ENTRY_SEMESTER.fieldApiName,
    PROGRAM: PROGRAM_ENROLLMENT_PROGRAM.fieldApiName
};

const APPLIED_ENROLLMENT_CONDITION = {
    SOBJECT: APPLIED_ENROLLMENT_CONDITION_SOBJECT.objectApiName,
    ENROLLMENT_CONDITION: APPLIED_ENROLLMENT_CONDITION_ENROLLMENT_CONDITION.fieldApiName,
    PROGRAM_ENROLLMENT: APPLIED_ENROLLMENT_CONDITION_PROGRAM_ENROLLMENT.fieldApiName
};

const CONTACT = {
    SOBJECT: CONTACT_SOBJECT.objectApiName,
    ID: CONTACT_ID.fieldApiName,
    NAME: CONTACT_NAME.fieldApiName,
    IS_ACTIVE: IS_ACTIVE.fieldApiName,
    CONTACT_RECORDTYPE_NAME: CONATCT_RECORDTYPE_NAME.fieldApiName
};

const SEMESTER = {
    SOBJECT: SEMESTER_SOBJECT.objectApiName,
    ID: SEMESTER_ID.fieldApiName,
    NAME: SEMESTER_NAME.fieldApiName,
    START_DATE: SEMESTER_START_DATE.fieldApiName
};

const PROGRAM = {
    SOBJECT: PROGRAM_SOBJECT.objectApiName,
    ID: PROGRAM_ID.fieldApiName,
    NAME: PROGRAM_NAME.fieldApiName,
    ACTIVE: PROGRAM_ACTIVE.fieldApiName
};

const ENROLLMENT_CONDITION = {
    SOBJECT: ENROLLMENT_CONDITION_SOBJECT.objectApiName,
    ID: ENROLLMENT_CONDITION_ID.fieldApiName,
    DESCRIPTION: ENROLLMENT_CONDITION_DESCRIPTION.fieldApiName
};

const CASE = {
    SOBJECT: CASE_SOBJECT.objectApiName,
    ID: CASE_ID.fieldApiName,
    STUDENT: CASE_STUDENT.fieldApiName,
    STUDENT_NAME: CASE_STUDENT_NAME.fieldApiName
};

export default class NewProgramEnrollmentForm extends NavigationMixin(LightningElement) {
    @api recordId;
    _student;
    _appliedEnrollmentConditions;
    _enrollmentConditions;

    get programEnrollmentSObject() {
        return PROGRAM_ENROLLMENT.SOBJECT;
    }

    get fields() {
        return [
            {
                label: 'Advisor',
                name: PROGRAM_ENROLLMENT.ADVISOR,
                type: 'lookup',
                required: true,
                options: {
                    query: new Query()
                        .select([CONTACT.NAME])
                        .from(CONTACT.SOBJECT)
                        .where([CONTACT.CONTACT_RECORDTYPE_NAME, '=', 'Advisor'])
                        .andWhere([CONTACT.IS_ACTIVE, '=', true]),
                    label: CONTACT.NAME,
                    value: CONTACT.ID
                }
            },
            {
                label: 'Entry Semester',
                name: PROGRAM_ENROLLMENT.ENTRY_SEMESTER,
                type: 'lookup',
                required: true,
                options: {
                    query: new Query()
                        .select([SEMESTER.ID, SEMESTER.NAME])
                        .from(SEMESTER.SOBJECT)
                        .where([SEMESTER.START_DATE, '>=', new Date().toISOString().split('T').shift()])
                        .limit(10),
                    label: SEMESTER.NAME,
                    value: SEMESTER.ID
                }
            },
            {
                label: 'Program',
                name: PROGRAM_ENROLLMENT.PROGRAM,
                type: 'lookup',
                required: true,
                options: {
                    query: new Query()
                        .select([PROGRAM.NAME])
                        .from(PROGRAM.SOBJECT)
                        .where([PROGRAM.ACTIVE, '=', true]),
                    label: PROGRAM.NAME,
                    value: PROGRAM.ID
                }
            }
        ];
    }

    get records() {
        return [this.student, this.enrollmentConditions];
    }

    get student() {
        return new Query()
            .select([CASE.STUDENT, CASE.STUDENT_NAME])
            .from(CASE.SOBJECT)
            .where([CASE.ID, '=', this.recordId])
            .submit();
    }

    get enrollmentConditions() {
        return new Query()
            .select([ENROLLMENT_CONDITION.ID, ENROLLMENT_CONDITION.DESCRIPTION])
            .from(ENROLLMENT_CONDITION.SOBJECT)
            .submit();
    }

    get enrollmentConditionOptions() {
        return this._enrollmentConditions ?? [];
    }

    handleOpen() {
        this.template.querySelector('c-record-form').open();
        this.template
            .querySelector('c-record-form')
            .updateRecord(PROGRAM_ENROLLMENT.STUDENT, formatValue({ field: CASE.STUDENT, record: this._student }));
        this._appliedEnrollmentConditions = new RecordProxyCollection(APPLIED_ENROLLMENT_CONDITION.SOBJECT);
    }

    handleResolved(event) {
        const {
            data: [[student], enrollmentConditions]
        } = event.detail;

        this._student = student;

        this._enrollmentConditions = enrollmentConditions.map((condition) => ({
            id: formatValue({ field: ENROLLMENT_CONDITION.ID, record: condition }),
            description: formatValue({ field: ENROLLMENT_CONDITION.DESCRIPTION, record: condition })
        }));
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }

    handleEnrollmentConditionChange(event) {
        const { value } = event.target;

        if (
            !value &&
            this._appliedEnrollmentConditions.has(APPLIED_ENROLLMENT_CONDITION.ENROLLMENT_CONDITION, value)
        ) {
            this._appliedEnrollmentConditions.remove(APPLIED_ENROLLMENT_CONDITION.ENROLLMENT_CONDITION, value);
            return;
        }

        this._appliedEnrollmentConditions.add(
            new RecordProxy(APPLIED_ENROLLMENT_CONDITION.SOBJECT).add(
                APPLIED_ENROLLMENT_CONDITION.ENROLLMENT_CONDITION,
                value
            )
        );
    }

    async handleSuccess(event) {
        const { id: programEnrollmentId, record: programEnrollment } = event.detail;

        this._appliedEnrollmentConditions.applyToEach(
            APPLIED_ENROLLMENT_CONDITION.PROGRAM_ENROLLMENT,
            programEnrollmentId
        );

        await this._appliedEnrollmentConditions.insert();

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: programEnrollment?.[PROGRAM_ENROLLMENT.STUDENT],
                objectApiName: CONTACT.SOBJECT,
                actionName: 'view'
            }
        });

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(async () => {
            await sendWelcomeEmail({ programEnrollmentId });
        }, 1000);
    }
}