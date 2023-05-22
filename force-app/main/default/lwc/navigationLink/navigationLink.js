import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { publish, MessageContext } from 'lightning/messageService';
import NavigationStream from '@salesforce/messageChannel/NavigationStream__c';
import COMMUNITY_PATH from '@salesforce/community/basePath';

export default class NavigationLink extends NavigationMixin(LightningElement) {
    @api label;
    @api page;
    @api recordId;

    get url() {
        return `${COMMUNITY_PATH}/${this.page}/${this.recordId ?? ''}`;
    }

    @wire(MessageContext) _messageContext;

    navigateToPage() {
        publish(this._messageContext, NavigationStream, { page: this.page });
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: this.url
            }
        });
    }
}