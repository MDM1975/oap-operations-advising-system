import { LightningElement, api, wire } from 'lwc';
import { formatValue } from 'c/lib';
import { subscribe, MessageContext } from 'lightning/messageService';
import PlanOfStudyStream from '@salesforce/messageChannel/PlanOfStudyStream__c';
import getProgramEnrollmentProgress from '@salesforce/apex/PlanOfStudyController.getProgramEnrollmentProgress';
import getPlannedSemesters from '@salesforce/apex/PlanOfStudyController.getPlannedSemesters';

import ENROLLMENT_PLANNED_SEMESTER_ID from '@salesforce/schema/Enrollment_Planned_Semester__c.Id';
import ENROLLMENT_PLANNED_SEMESTER_SEMESTER_TITLE from '@salesforce/schema/Enrollment_Planned_Semester__c.Semester__r.Semester_Title__c';

const ENROLLMENT_PLANNED_SEMESTER = {
    ID: ENROLLMENT_PLANNED_SEMESTER_ID.fieldApiName,
    SEMESTER_TITLE: ENROLLMENT_PLANNED_SEMESTER_SEMESTER_TITLE.fieldApiName
};

export default class PlanOfStudyBoard extends LightningElement {
    @api recordId;
    _progress;
    _semesters;

    get planOfStudy() {
        return !this.recordId
            ? []
            : [
                  getProgramEnrollmentProgress({ studentId: this.recordId }),
                  getPlannedSemesters({ studentId: this.recordId })
              ];
    }

    get hasPlanOfStudy() {
        return this.semesters && this.semesters?.length > 0;
    }

    get progress() {
        return {
            totalCredits: this._progress?.totalCredits ?? 0,
            creditsEarned: this._progress?.creditsEarned ?? 0,
            creditsRemaining: (() => {
                return this._progress?.creditsRemaining >= 0 ? this._progress?.creditsRemaining : 0;
            })(),
            percentageComplete: (() => {
                return this._progress?.creditsEarned
                    ? (this._progress?.creditsEarned / this._progress?.totalCredits) * 100
                    : 0;
            })()
        };
    }

    get semesters() {
        return this._semesters?.map((semester) => ({
            id: formatValue({ field: ENROLLMENT_PLANNED_SEMESTER.ID, record: semester }),
            title: formatValue({ field: ENROLLMENT_PLANNED_SEMESTER.SEMESTER_TITLE, record: semester })
        }));
    }

    @wire(MessageContext) _messageContext;

    connectedCallback() {
        subscribe(this._messageContext, PlanOfStudyStream, () => this._refresh());
    }

    handleResolved(event) {
        const [progress, semesters] = event.detail.data;
        this._progress = progress ? { ...progress } : {};
        this._semesters = semesters ? [...semesters] : [];
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(JSON.stringify(error, null, 2));
    }

    handleAddSemester() {
        this.template.querySelector('c-new-planned-semester-form').open();
    }

    async _refresh() {
        try {
            this._progress = await getProgramEnrollmentProgress({ studentId: this.recordId });
            this._semesters = await getPlannedSemesters({ studentId: this.recordId });
            this.template.querySelectorAll('c-plan-of-study-semester-card').forEach((card) => card.refresh());
        } catch (error) {
            console.error(error);
            throw new Error(JSON.stringify(error, null, 2));
        }
    }
}