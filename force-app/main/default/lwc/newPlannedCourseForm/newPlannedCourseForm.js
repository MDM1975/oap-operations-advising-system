import { LightningElement, api, wire } from 'lwc';
import { RecordProxy, formatValue } from 'c/lib';
import { publish, MessageContext } from 'lightning/messageService';
import PlanOfStudyStream from '@salesforce/messageChannel/PlanOfStudyStream__c';
import getRequiredCourseOptions from '@salesforce/apex/PlanOfStudyController.getRequiredCourseOptions';
import getElectiveCourseOptions from '@salesforce/apex/PlanOfStudyController.getElectiveCourseOptions';
import getSpecialCourseOptions from '@salesforce/apex/PlanOfStudyController.getSpecialCourseOptions';

import COURSE_ID from '@salesforce/schema/Course__c.Id';
import COURSE_NAME from '@salesforce/schema/Course__c.Name';

import COURSE_CATALOG_REQUIRED_COURSE_SOBJECT from '@salesforce/schema/Course_Catalog_Required_Course__c';
import COURSE_CATALOG_REQUIRED_COURSE_COURSE from '@salesforce/schema/Course_Catalog_Required_Course__c.Course__c';
import COURSE_CATALOG_REQUIRED_COURSE_COURSE_NAME from '@salesforce/schema/Course_Catalog_Required_Course__c.Course__r.Name';

import COURSE_CATALOG_ELECTIVE_COURSE_SOBJECT from '@salesforce/schema/Course_Catalog_Elective_Course__c';
import COURSE_CATALOG_ELECTIVE_COURSE_COURSE from '@salesforce/schema/Course_Catalog_Elective_Course__c.Course__c';
import COURSE_CATALOG_ELECTIVE_COURSE_COURSE_NAME from '@salesforce/schema/Course_Catalog_Elective_Course__c.Course__r.Name';

import ENROLLMENT_PLANNED_COURSE_SOBJECT from '@salesforce/schema/Enrollment_Planned_Course__c';
import ENROLLMENT_PLANNED_COURSE_PLANNED_SEMESTER from '@salesforce/schema/Enrollment_Planned_Course__c.Enrollment_Planned_Semester__c';
import ENROLLMENT_PLANNED_COURSE_COURSE from '@salesforce/schema/Enrollment_Planned_Course__c.Course__c';

const COURSE = {
    ID: COURSE_ID.fieldApiName,
    NAME: COURSE_NAME.fieldApiName
};

const COURSE_CATALOG_REQUIRED_COURSE = {
    SOBJECT: COURSE_CATALOG_REQUIRED_COURSE_SOBJECT.objectApiName,
    COURSE: COURSE_CATALOG_REQUIRED_COURSE_COURSE.fieldApiName,
    COURSE_NAME: COURSE_CATALOG_REQUIRED_COURSE_COURSE_NAME.fieldApiName
};

const COURSE_CATALOG_ELECTIVE_COURSE = {
    SOBJECT: COURSE_CATALOG_ELECTIVE_COURSE_SOBJECT.objectApiName,
    COURSE: COURSE_CATALOG_ELECTIVE_COURSE_COURSE.fieldApiName,
    COURSE_NAME: COURSE_CATALOG_ELECTIVE_COURSE_COURSE_NAME.fieldApiName
};

const ENROLLMENT_PLANNED_COURSE = {
    SOBJECT: ENROLLMENT_PLANNED_COURSE_SOBJECT.objectApiName,
    SEMESTER: ENROLLMENT_PLANNED_COURSE_PLANNED_SEMESTER.fieldApiName,
    COURSE: ENROLLMENT_PLANNED_COURSE_COURSE.fieldApiName
};

export default class NewPlannedCourseForm extends LightningElement {
    @api plannedSemester;
    _electiveCourses;
    _requiredCourses;
    _specialCourses;
    _plannedCourse;

    @wire(MessageContext) _messageContext;

    get requiredCourseOptions() {
        return this._requiredCourses?.map((record) => ({
            label: formatValue({ field: COURSE_CATALOG_REQUIRED_COURSE.COURSE_NAME, record }),
            value: formatValue({ field: COURSE_CATALOG_REQUIRED_COURSE.COURSE, record })
        }));
    }

    get electiveCourseOptions() {
        return this._electiveCourses?.map((record) => ({
            label: formatValue({ field: COURSE_CATALOG_ELECTIVE_COURSE.COURSE_NAME, record }),
            value: formatValue({ field: COURSE_CATALOG_ELECTIVE_COURSE.COURSE, record })
        }));
    }

    get specialCourseOptions() {
        return this._specialCourses?.map((record) => ({
            label: formatValue({ field: COURSE.NAME, record }),
            value: formatValue({ field: COURSE.ID, record })
        }));
    }

    get requiredCoursePlaceholder() {
        return this._requiredCourses?.length === 0 ? 'No required courses available' : 'Select a required course';
    }

    get electiveCoursePlaceholder() {
        return this._electiveCourses?.length === 0 ? 'No elective courses available' : 'Select an elective course';
    }

    get specialCoursePlaceholder() {
        return this._specialCourses?.length === 0 ? 'No special courses available' : 'Select a special course';
    }

    renderedCallback() {
        this._getComboboxes()?.forEach((combobox) => {
            if (combobox.name === 'requiredCourses') {
                combobox.disabled = this._requiredCourses?.length === 0;
            }

            if (combobox.name === 'electiveCourses') {
                combobox.disabled = this._electiveCourses?.length === 0;
            }

            if (combobox.name === 'specialCourses') {
                combobox.disabled = this._specialCourses?.length === 0;
            }
        });
    }

    @api open() {
        this._reset();
        this.template.querySelector('c-modal').open();
    }

    handleCancel() {
        this._reset();
        this.template.querySelector('c-modal').close();
    }

    handleCourseChange(event) {
        const { value, name } = event.target;
        this._plannedCourse.add(ENROLLMENT_PLANNED_COURSE.COURSE, value);
        this._getComboboxes().forEach((combobox) => {
            combobox.disabled = combobox.name !== name ? true : false;
            this._displayErrors();
        });
    }

    async handleSave() {
        try {
            if (!this._plannedCourse.fields.Course__c) {
                this._displayErrors();
                return;
            }

            this.template.querySelector('c-modal').showSpinner();
            const { id } = await this._plannedCourse.insert();

            if (id) {
                publish(this._messageContext, PlanOfStudyStream);
                this.template.querySelector('c-modal').close();
            }
        } catch (error) {
            throw new Error(JSON.stringify(error, null, 4));
        } finally {
            this.template.querySelector('c-modal').hideSpinner();
        }
    }

    _displayErrors() {
        this._getComboboxes().forEach((combobox) => {
            if (!combobox.value && !combobox.disabled) {
                combobox.setCustomValidity('Complete this field.');
                combobox.reportValidity();
                return;
            }
            combobox.setCustomValidity('');
            combobox.reportValidity();
        });
    }

    _getComboboxes() {
        return this.template.querySelectorAll('lightning-combobox');
    }

    async _reset() {
        try {
            this._plannedCourse = new RecordProxy(ENROLLMENT_PLANNED_COURSE.SOBJECT);
            this._plannedCourse.add(ENROLLMENT_PLANNED_COURSE.SEMESTER, this.plannedSemester.id);
            this._requiredCourses = await getRequiredCourseOptions({ plannedSemesterId: this.plannedSemester.id });
            this._electiveCourses = await getElectiveCourseOptions({ plannedSemesterId: this.plannedSemester.id });
            this._specialCourses = await getSpecialCourseOptions();
        } catch (error) {
            throw new Error(JSON.stringify(error, null, 4));
        }
    }
}