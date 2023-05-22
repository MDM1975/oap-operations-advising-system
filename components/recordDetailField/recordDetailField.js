import { LightningElement, api, wire } from 'lwc';
import { RecordProxy, formatLookupField } from 'c/lib';
import { publish, MessageContext } from 'lightning/messageService';
import RecordPageStream from '@salesforce/messageChannel/RecordPageStream__c';
import getMetadataCombobox from '@salesforce/apex/UiComboboxService.getMetadataCombobox';
import getRecordCombobox from '@salesforce/apex/UiComboboxService.getRecordCombobox';

const FIELD_STATE = {
    STATIC: 'static',
    EDIT: 'edit'
};

export default class RecordDetailField extends LightningElement {
    _field;
    _value;
    _record;
    _options;
    _state = FIELD_STATE.STATIC;

    @wire(MessageContext) _messageContext;

    @api set field(value) {
        this._field = { ...value.field, url: value?.url };
        this._value = value.value;
        this._setRecord(value);
        this._setInputOptions();
    }

    get field() {
        return this._field;
    }

    get value() {
        return this._value;
    }

    get dateValue() {
        return this._value ? new Date(this._value.replace(/-/g, '/')) : new Date();
    }

    get placeholder() {
        return this._value ?? '--None--';
    }

    get options() {
        return this._options ?? [];
    }

    get isStatic() {
        return this._state === FIELD_STATE.STATIC;
    }

    get isEditable() {
        return this._field.readonly === false;
    }

    get isLink() {
        return this._field.url;
    }

    get isEmail() {
        return this._field.type === 'email';
    }

    get isPhone() {
        return this._field.type === 'tel';
    }

    get isDate() {
        return this._field.type === 'date';
    }

    get isNumber() {
        return this._field.type === 'number';
    }

    get isCombobox() {
        return this._field.type === 'lookup' || this._field.type === 'picklist';
    }

    get isTextarea() {
        return this._field.type === 'textarea';
    }

    handleEdit() {
        this._state = FIELD_STATE.EDIT;
    }

    handleCancel() {
        this._state = FIELD_STATE.STATIC;
    }

    handleSave() {
        const input = this._getInputField();

        if (input.value === this._value) {
            this._state = FIELD_STATE.STATIC;
            return;
        }

        if (!this._isValid()) {
            input.setCustomValidity('Invalid value');
            input.reportValidity();
            return;
        }

        this._updateRecord(input);
    }

    async _updateRecord(input) {
        try {
            const field =
                this._field.type === 'lookup' ? formatLookupField({ field: this._field.name }) : this._field.name;
            this._record.add(field, input.value);
            const record = await this._record.update();

            if (record) {
                this._updateDisplay();
                publish(this._messageContext, RecordPageStream, { record: record });
                this._state = FIELD_STATE.STATIC;
            }
        } catch (error) {
            throw new Error(`Error while updating record: ${JSON.stringify(error, null, 2)}`);
        }
    }

    _isValid() {
        const input = this._getInputField();
        return input.validity.valid;
    }

    _showErrors() {
        const input = this._getInputField();
        switch (true) {
            case input.validity.valueMissing:
                input.setCustomValidity('This field is required');
                break;
            case input.validity.patternMismatch:
                input.setCustomValidity('Invalid value');
                break;
            default:
                input.setCustomValidity('');
                break;
        }
        input.reportValidity();
    }

    _updateDisplay() {
        const input = this._getInputField();
        switch (this._field.type) {
            case 'date':
                this._value = input.value;
                break;
            case 'lookup':
                this._value = this._options.find((option) => option.value === input.value).label;
                break;
            default:
                this._value = input.value;
        }
    }

    _getInputField() {
        return this.template.querySelector('lightning-input, lightning-combobox, lightning-textarea');
    }

    _setRecord({ record: { Id: id } }) {
        this._record = new RecordProxy();
        this._record.add('Id', id);
    }

    _setInputOptions() {
        switch (this._field.type) {
            case 'lookup':
                this._setLookupOptions(this._field.options);
                break;
            case 'picklist':
                this._setPicklistOptions(this._field.options);
                break;
            default:
                break;
        }
    }

    async _setLookupOptions({ query, label, value }) {
        try {
            const records = await query.submit();
            const options = await getRecordCombobox({ records, labelField: label, valueField: value });
            this._options = JSON.parse(options);
        } catch (error) {
            throw new Error(`Error while fetching lookup options: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async _setPicklistOptions({ sobject, field }) {
        try {
            const options = await getMetadataCombobox({ sObjectName: sobject, fieldName: field });
            this._options = JSON.parse(options);
        } catch (error) {
            throw new Error(`Error while fetching picklist options: ${JSON.stringify(error, null, 2)}`);
        }
    }
}