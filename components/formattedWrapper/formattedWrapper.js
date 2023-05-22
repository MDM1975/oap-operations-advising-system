import { LightningElement, api } from 'lwc';

export default class FormattedWrapper extends LightningElement {
    @api withBorder;

    get style() {
        return this.withBorder === 'false' ? '' : 'slds-box';
    }
}