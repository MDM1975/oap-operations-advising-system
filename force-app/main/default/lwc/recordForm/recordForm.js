import { LightningElement, api, wire } from 'lwc';
import { Query, RecordProxy } from 'c/lib';
import { NavigationMixin } from 'lightning/navigation';
import { publish, MessageContext } from 'lightning/messageService';
import NavigationStream from '@salesforce/messageChannel/NavigationStream__c';

import RECORD_TYPE_SOBJECT from '@salesforce/schema/RecordType';
import RECORD_TYPE_ID from '@salesforce/schema/RecordType.Id';
import RECORD_TYPE_NAME from '@salesforce/schema/RecordType.Name';
import RECORD_TYPE_SOBJECT_TYPE from '@salesforce/schema/RecordType.SobjectType';

const RECORDTYPE = {
    SOBJECT: RECORD_TYPE_SOBJECT.objectApiName,
    ID: RECORD_TYPE_ID.fieldApiName,
    NAME: RECORD_TYPE_NAME.fieldApiName,
    SOBJECT_TYPE: RECORD_TYPE_SOBJECT_TYPE.fieldApiName
};

export default class RecordForm extends NavigationMixin(LightningElement) {
    @api title;
    @api size;
    @api fields;
    @api recordType;
    _record;

    @api set sObject(value) {
        this._record = new RecordProxy(value);
    }

    get sObject() {
        return this._record.sObject;
    }

    get hasRecordType() {
        return this.recordType !== undefined;
    }

    get recordTypeId() {
        return new Query()
            .select([RECORDTYPE.ID])
            .from(RECORDTYPE.SOBJECT)
            .where([RECORDTYPE.SOBJECT_TYPE, '=', this.sObject])
            .andWhere([RECORDTYPE.NAME, '=', this.recordType])
            .submit();
    }

    get style() {
        return this.fields?.length > 2
            ? 'slds-col slds-form-element slds-form-element_stacked slds-p-top_small slds-size_1-of-2'
            : 'slds-col slds-form-element slds-form-element_stacked slds-p-top_small slds-size_1-of-1';
    }

    @wire(MessageContext) _messageContext;

    @api open() {
        this.template.querySelector('c-modal').open();
        this._reset();
    }

    @api close() {
        this._reset();
        this.template.querySelector('c-modal').hideSpinner();
        this.template.querySelector('c-modal').close();
    }

    @api updateRecord(field, value) {
        this._record.add(field, value);
    }

    @api navigate(navigationId, objectName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: navigationId,
                objectApiName: objectName ?? this.sObject,
                actionName: 'view'
            }
        });
    }

    handleCancel() {
        this.template.querySelector('c-modal').close();
    }

    handleSubmit() {
        if (this._hasErrors()) {
            return;
        }
        this._processSubmission();
    }

    handleResolved(event) {
        const {
            data: [{ [RECORDTYPE.ID]: recordTypeId }]
        } = event.detail;

        this._record.add('RecordTypeId', recordTypeId);
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }

    handleFieldChange(event) {
        const { field, value } = event.detail;
        if (field && value) {
            this._record.add(field, value);
        }
    }

    _reset() {
        this.template.querySelectorAll('c-record-form-field').forEach((field) => field.reset());
    }

    _hasErrors() {
        const fields = Array.from(this.template.querySelectorAll('c-record-form-field'));
        fields.forEach((field) => field.displayValidity());
        return fields.some((field) => !field.isValid());
    }

    async _processSubmission() {
        try {
            this.template.querySelector('c-modal').showSpinner();
            const { id, record } = await this._record.insert();
            if (id) {
                publish(this._messageContext, NavigationStream, { page: this.sObject });
                this.dispatchEvent(new CustomEvent('success', { detail: { id, record } }));
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
            throw new Error(JSON.stringify(error, null, 4));
        } finally {
            this.template.querySelector('c-modal').hideSpinner();
            this.template.querySelector('c-modal').close();
        }
    }
}