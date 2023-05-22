import { LightningElement } from 'lwc';
import { Query, formatValue } from 'c/lib';

import ANNOUNCEMENT_SOBJECT from '@salesforce/schema/Announcement__c';
import ANNOUNCEMENT_SUBJECT from '@salesforce/schema/Announcement__c.Subject__c';
import ANNOUNCEMENT_DESCRIPTION from '@salesforce/schema/Announcement__c.Description__c';
import ANNOUNCEMENT_ACTIVE from '@salesforce/schema/Announcement__c.Active__c';
import ANNOUNCEMENT_CREATED_DATE from '@salesforce/schema/Announcement__c.CreatedDate';
import ANNOUNCEMENT_CREATED_BY from '@salesforce/schema/Announcement__c.CreatedBy.Name';

const ANNOUNCEMENT = {
    SOBJECT: ANNOUNCEMENT_SOBJECT.objectApiName,
    SUBJECT: ANNOUNCEMENT_SUBJECT.fieldApiName,
    DESCRIPTION: ANNOUNCEMENT_DESCRIPTION.fieldApiName,
    ACTIVE: ANNOUNCEMENT_ACTIVE.fieldApiName,
    CREATED_DATE: ANNOUNCEMENT_CREATED_DATE.fieldApiName,
    CREATED_BY: ANNOUNCEMENT_CREATED_BY.fieldApiName
};

export default class ActiveAnnouncementsList extends LightningElement {
    _index = 0;
    _announcements;

    get hasAnnouncements() {
        return this._announcements && this._announcements.length > 0;
    }

    get announcement() {
        const { [ANNOUNCEMENT.SUBJECT]: subject, [ANNOUNCEMENT.DESCRIPTION]: description } =
            this._announcements[this._index];
        return { subject, description };
    }

    get details() {
        return {
            author: formatValue({
                field: ANNOUNCEMENT.CREATED_BY,
                record: this._announcements[this._index]
            }),
            date: formatValue({
                field: ANNOUNCEMENT.CREATED_DATE,
                record: this._announcements[this._index]
            })
        };
    }

    get page() {
        return this._index + 1;
    }

    get pages() {
        return this._announcements ? this._announcements.length : 0;
    }

    start() {
        this._index = 0;
    }

    next() {
        if (this._index < this._announcements.length - 1) {
            this._index++;
        }
    }

    back() {
        if (this._index > 0) {
            this._index--;
        }
    }

    end() {
        this._index = this._announcements.length - 1;
    }

    async connectedCallback() {
        this._announcements = await new Query()
            .select([
                ANNOUNCEMENT.SUBJECT,
                ANNOUNCEMENT.DESCRIPTION,
                ANNOUNCEMENT.CREATED_DATE,
                ANNOUNCEMENT.CREATED_BY
            ])
            .from(ANNOUNCEMENT.SOBJECT)
            .where([ANNOUNCEMENT.ACTIVE, '!=', false])
            .submit();
    }
}