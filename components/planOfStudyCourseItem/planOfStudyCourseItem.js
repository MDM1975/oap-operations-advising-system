import { LightningElement, api, wire } from 'lwc';
import { RecordProxy } from 'c/lib';
import { publish, MessageContext } from 'lightning/messageService';
import PlanOfStudyStream from '@salesforce/messageChannel/PlanOfStudyStream__c';

import ENROLLMENT_PLANNED_COURSE_SOBJECT from '@salesforce/schema/Enrollment_Planned_Course__c';
import ENROLLMENT_PLANNED_COURSE_ID from '@salesforce/schema/Enrollment_Planned_Course__c.Id';

const ENROLLMENT_PLANNED_COURSE = {
    SOBJECT: ENROLLMENT_PLANNED_COURSE_SOBJECT.objectApiName,
    ID: ENROLLMENT_PLANNED_COURSE_ID.fieldApiName
};

export default class PlanOfStudyCourseItem extends LightningElement {
    _course;
    _plannedCourse;

    @wire(MessageContext) _messageContext;

    @api set course(value) {
        this._course = value;
        this._plannedCourse = new RecordProxy();
        this._plannedCourse.add(ENROLLMENT_PLANNED_COURSE.ID, value.id);
    }

    get course() {
        return {
            id: this._course.courseId,
            title: this._course.title
        };
    }

    handleRemoveCourse() {
        console.log('handleRemoveCourse');
        this.template.querySelector('c-modal').open();
    }

    handleCancel() {
        this.template.querySelector('c-modal').close();
    }

    async handleDelete() {
        console.log('handleDelete');
        try {
            this.template.querySelector('c-modal').showSpinner();
            console.log('this._plannedCourse', JSON.stringify(this._plannedCourse, null, 4));
            const isDeleted = await this._plannedCourse.delete();
            console.log('isDeleted', isDeleted);
            if (isDeleted) {
                publish(this._messageContext, PlanOfStudyStream);
                this.template.querySelector('c-modal').close();
            }
        } catch (error) {
            console.error('error', JSON.stringify(error, null, 4));
            throw new Error(JSON.stringify(error, null, 4));
        } finally {
            this.template.querySelector('c-modal').hideSpinner();
        }
    }
}