import { LightningElement, api } from 'lwc';
import { Query, formatRelationshipName, formatValue } from 'c/lib';

import COURSE_SOBJECT from '@salesforce/schema/Course__c';
import COURSE_ID from '@salesforce/schema/Course__c.Id';

import SEMESTER_SESSION_COURSE_OFFERING_SOBJECT from '@salesforce/schema/Semester_Session_Course_Offering__c';
import SEMESTER_SESSION_COURSE_OFFERING_ID from '@salesforce/schema/Semester_Session_Course_Offering__c.Id';
import SEMESTER_SESSION_COURSE_OFFERING_SEMESTER_SESSION_TITLE from '@salesforce/schema/Semester_Session_Course_Offering__c.Semester_Session__r.Semester_Session_Title__c';

const COURSE = {
    SOBJECT: COURSE_SOBJECT.objectApiName,
    ID: COURSE_ID.fieldApiName
};

const SEMESTER_SESSION_COURSE_OFFERING = {
    SOBJECT: formatRelationshipName({ sobject: SEMESTER_SESSION_COURSE_OFFERING_SOBJECT.objectApiName }),
    ID: SEMESTER_SESSION_COURSE_OFFERING_ID.fieldApiName,
    SEMESTER_SESSION_TITLE: SEMESTER_SESSION_COURSE_OFFERING_SEMESTER_SESSION_TITLE.fieldApiName
};

export default class CourseSessionOfferingList extends LightningElement {
    @api recordId;
    _sessions;

    get hasSessions() {
        return this.sessions && this.sessions?.length > 0;
    }

    get sessions() {
        return this._sessions?.map((session) => ({
            id: formatValue({
                field: SEMESTER_SESSION_COURSE_OFFERING.ID,
                record: session
            }),
            title: formatValue({
                field: SEMESTER_SESSION_COURSE_OFFERING.SEMESTER_SESSION_TITLE,
                record: session
            })
        }));
    }

    async connectedCallback() {
        const [{ [SEMESTER_SESSION_COURSE_OFFERING.SOBJECT]: sessions }] = await new Query()
            .select([
                new Query()
                    .select([
                        SEMESTER_SESSION_COURSE_OFFERING.ID,
                        SEMESTER_SESSION_COURSE_OFFERING.SEMESTER_SESSION_TITLE
                    ])
                    .from(SEMESTER_SESSION_COURSE_OFFERING.SOBJECT)
            ])
            .from(COURSE.SOBJECT)
            .where([COURSE.ID, '=', this.recordId])
            .submit();

        this._sessions = sessions;
    }
}