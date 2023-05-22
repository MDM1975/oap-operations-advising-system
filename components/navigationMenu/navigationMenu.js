import { LightningElement, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { subscribe, MessageContext } from 'lightning/messageService';
import NavigationStream from '@salesforce/messageChannel/NavigationStream__c';
import COMMUNITY_PATH from '@salesforce/community/basePath';

const RECORD_PAGES = {
    student: 'advising',
    program: 'programs',
    case: 'cases-and-reminders',
    reminder: 'cases-and-reminders',
    course: 'courses'
};

// standard__recordPage-->attributes--> objectApiName: (Course__c, Program__c, Advising__c, Case, Reminder__c, Contact)
// comm__namedPage-->attributes-->name--> (Advising__c, Cases_and_Reminders__c, Courses__c, Programs__c)

export default class NavigationMenu extends NavigationMixin(LightningElement) {
    get homeUrl() {
        return `${COMMUNITY_PATH}/`;
    }

    get advisingUrl() {
        return `${COMMUNITY_PATH}/advising`;
    }

    get programsUrl() {
        return `${COMMUNITY_PATH}/programs`;
    }

    get casesAndRemindersUrl() {
        return `${COMMUNITY_PATH}/cases-and-reminders`;
    }

    get coursesUrl() {
        return `${COMMUNITY_PATH}/courses`;
    }

    @wire(CurrentPageReference) _pageRef;

    @wire(MessageContext) _messageContext;

    connectedCallback() {
        subscribe(this._messageContext, NavigationStream, (recordPage) =>
            this._mapRecordPageToMenuItem(recordPage)
        );
    }

    handleNavigation(event) {
        const { url } = event.currentTarget.dataset;
        this._navigateToUrl(url);
        this._setActiveMenuItem(url);
    }

    _navigateToUrl(url) {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: { url }
        });
    }

    _mapRecordPageToMenuItem(recordPage) {
        const { page } = recordPage;
        const url = `${COMMUNITY_PATH}/${RECORD_PAGES[page]}`;
        this._setActiveMenuItem(url);
    }

    _setActiveMenuItem(url) {
        this.template.querySelectorAll('.nav-menu__item').forEach((item) => {
            item.classList.toggle('active', item.dataset.url === url);
        });
    }
}