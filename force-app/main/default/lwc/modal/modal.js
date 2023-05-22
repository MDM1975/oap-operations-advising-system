import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
    @api size;
    isActive = false;
    isLoading = false;

    get style() {
        switch (this.size) {
            case 'small':
                return 'modal-body modal-container__small slds-is-relative';
            case 'medium':
                return 'modal-body modal-container__medium slds-is-relative';
            case 'large':
                return 'modal-body modal-container__large slds-is-relative';
            default:
                return 'modal-body modal-container__small slds-is-relative';
        }
    }

    @api open() {
        this.isActive = true;
    }

    @api close() {
        this.isActive = false;
        this.hideSpinner();
    }

    @api showSpinner() {
        this.isLoading = true;
    }

    @api hideSpinner() {
        this.isLoading = false;
    }

    handleClose() {
        this.close();
        this.dispatchEvent(new CustomEvent('close'));
    }
}