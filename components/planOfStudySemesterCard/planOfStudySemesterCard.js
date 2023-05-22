import { LightningElement, api, wire } from 'lwc';
import { RecordProxy, formatValue } from 'c/lib';
import { publish, MessageContext } from 'lightning/messageService';
import PlanOfStudyStream from '@salesforce/messageChannel/PlanOfStudyStream__c';
import getPlannedSemesterDetails from '@salesforce/apex/PlanOfStudyController.getPlannedSemesterDetails';
import getPlannedCourses from '@salesforce/apex/PlanOfStudyController.getPlannedCourses';

import ENROLLMENT_PLANNED_SEMESTER_SOBJECT from '@salesforce/schema/Enrollment_Planned_Semester__c';
import ENROLLMENT_PLANNED_SEMESTER_ID from '@salesforce/schema/Enrollment_Planned_Semester__c.Id';
import ENROLLMENT_PLANNED_SEMESTER_PART_OF_TERM from '@salesforce/schema/Enrollment_Planned_Semester__c.Semester__r.Part_of_Term__c';
import ENROLLMENT_PLANNED_SEMESTER_START_DATE from '@salesforce/schema/Enrollment_Planned_Semester__c.Semester__r.Start_Date__c';
import ENROLLMENT_PLANNED_SEMESTER_END_DATE from '@salesforce/schema/Enrollment_Planned_Semester__c.Semester__r.End_Date__c';
import ENROLLMENT_PLANNED_SEMESTER_PLANNED_OFF from '@salesforce/schema/Enrollment_Planned_Semester__c.Planned_Off__c';

import ENROLLMENT_PLANNED_COURSE_SOBJECT from '@salesforce/schema/Enrollment_Planned_Course__c';
import ENROLLMENT_PLANNED_COURSE_ID from '@salesforce/schema/Enrollment_Planned_Course__c.Id';
import ENROLLMENT_PLANNED_COURSE_COURSE from '@salesforce/schema/Enrollment_Planned_Course__c.Course__c';
import ENROLLMENT_PLANNED_COURSE_COURSE_TITLE from '@salesforce/schema/Enrollment_Planned_Course__c.Course__r.Course_Title__c';

const ENROLLMENT_PLANNED_SEMESTER = {
    SOBJECT: ENROLLMENT_PLANNED_SEMESTER_SOBJECT.objectApiName,
    ID: ENROLLMENT_PLANNED_SEMESTER_ID.fieldApiName,
    PART_OF_TERM: ENROLLMENT_PLANNED_SEMESTER_PART_OF_TERM.fieldApiName,
    START_DATE: ENROLLMENT_PLANNED_SEMESTER_START_DATE.fieldApiName,
    END_DATE: ENROLLMENT_PLANNED_SEMESTER_END_DATE.fieldApiName,
    PLANNED_OFF: ENROLLMENT_PLANNED_SEMESTER_PLANNED_OFF.fieldApiName
};

const ENROLLMENT_PLANNED_COURSE = {
    SOBJECT: ENROLLMENT_PLANNED_COURSE_SOBJECT.objectApiName,
    ID: ENROLLMENT_PLANNED_COURSE_ID.fieldApiName,
    COURSE: ENROLLMENT_PLANNED_COURSE_COURSE.fieldApiName,
    COURSE_TITLE: ENROLLMENT_PLANNED_COURSE_COURSE_TITLE.fieldApiName
};

export default class PlanOfStudySemesterCard extends LightningElement {
    _semester;
    _courses;
    _plannedSemester;
    _isEditing;

    @wire(MessageContext) _messageContext;

    @api set semester(value) {
        const { id, title } = value;
        this._semester = { id, title };
        this._plannedSemester = new RecordProxy(ENROLLMENT_PLANNED_SEMESTER.SOBJECT);
        this._plannedSemester.add(ENROLLMENT_PLANNED_SEMESTER.ID, this._semester.id);
        this._reset();
    }

    get semester() {
        return this._semester;
    }

    get isCurrentOrFutureSemester() {
        return new Date() < new Date(this._semester.endDate);
    }

    get courses() {
        return this._courses?.map((course) => ({
            id: formatValue({ field: ENROLLMENT_PLANNED_COURSE.ID, record: course }),
            title: formatValue({ field: ENROLLMENT_PLANNED_COURSE.COURSE_TITLE, record: course }),
            courseId: formatValue({ field: ENROLLMENT_PLANNED_COURSE.COURSE, record: course })
        }));
    }

    get style() {
        return this._semester.plannedOff
            ? 'slds-box slds-theme_shade slds-theme_alert-texture slds-grid slds-grid_vertical'
            : 'slds-box slds-grid slds-grid_vertical';
    }

    get isEditing() {
        return this._isEditing;
    }

    @api refresh() {
        this._reset();
    }

    handleEdit() {
        this._isEditing = true;
    }

    handleAddCourse() {
        this.template.querySelector('c-new-planned-course-form').open();
    }

    handleRemoveSemester() {
        this.template.querySelector('c-modal[data-name="remove"]').open();
    }

    handlePlanOffSemester() {
        this.template.querySelector('c-modal[data-name="plan-off"]').open();
    }

    handleCancel() {
        this.template.querySelectorAll('c-modal').forEach((modal) => modal.close());
        this._isEditing = false;
    }

    async handleDelete() {
        try {
            this.template.querySelector('c-modal[data-name="remove"]').showSpinner();
            const isDeleted = await this._plannedSemester.delete();

            if (isDeleted) {
                publish(this._messageContext, PlanOfStudyStream);
                this.template.querySelector('c-modal[data-name="remove"]').close();
            }
        } catch (error) {
            throw new Error(JSON.stringify(error, null, 2));
        } finally {
            this.template.querySelector('c-modal[data-name="remove"]').hideSpinner();
            this._isEditing = false;
        }
    }

    async handleUpdate() {
        try {
            this.template.querySelector('c-modal[data-name="plan-off"]').showSpinner();
            this._plannedSemester.add(ENROLLMENT_PLANNED_SEMESTER.PLANNED_OFF, true);
            const updatedSemester = await this._plannedSemester.update();

            if (updatedSemester?.[ENROLLMENT_PLANNED_SEMESTER.PLANNED_OFF]) {
                publish(this._messageContext, PlanOfStudyStream);
                this.template.querySelector('c-modal[data-name="plan-off"]').close();
            }
        } catch (error) {
            throw new Error(JSON.stringify(error, null, 2));
        } finally {
            this.template.querySelector('c-modal[data-name="plan-off"]').hideSpinner();
            this._isEditing = false;
        }
    }

    async _reset() {
        try {
            const semester = await getPlannedSemesterDetails({ plannedSemesterId: this._semester.id });
            this._semester = {
                ...this._semester,
                plannedOff: formatValue({ field: ENROLLMENT_PLANNED_SEMESTER.PLANNED_OFF, record: semester }),
                partOfTerm: formatValue({ field: ENROLLMENT_PLANNED_SEMESTER.PART_OF_TERM, record: semester }),
                startDate: formatValue({ field: ENROLLMENT_PLANNED_SEMESTER.START_DATE, record: semester }),
                endDate: formatValue({ field: ENROLLMENT_PLANNED_SEMESTER.END_DATE, record: semester })
            };

            this._courses = await getPlannedCourses({ plannedSemesterId: this._semester.id });
        } catch (error) {
            throw new Error(JSON.stringify(error, null, 4));
        }
    }
}