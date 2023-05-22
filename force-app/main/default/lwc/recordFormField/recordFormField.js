import { LightningElement, api } from 'lwc';
import getMetadataCombobox from '@salesforce/apex/UiComboboxService.getMetadataCombobox';
import getRecordCombobox from '@salesforce/apex/UiComboboxService.getRecordCombobox';

export default class RecordFormField extends LightningElement {
    _field;
    _comboboxOptions;

    @api set field(value) {
        this._field = value;
        this._setFieldOptions();
    }

    get field() {
        return this._field;
    }

    get placeholder() {
        return this._field.placeholder ?? 'Select an option';
    }

    get isCombobox() {
        return this._field.type === 'lookup' || this._field.type === 'picklist';
    }

    get isTextarea() {
        return this._field.type === 'textarea';
    }

    get isRequired() {
        return this._field.required ?? false;
    }

    get options() {
        return this._comboboxOptions ?? [];
    }

    @api reset() {
        const input = this._getInputField();
        input.value = '';
        input.setCustomValidity('');
    }

    @api displayValidity() {
        this._showErrors();
    }

    @api isValid() {
        const input = this._getInputField();
        return input.validity.valid;
    }

    handleInputChange(event) {
        this._showErrors();
        const { value, type } = event.target;
        if (value) {
            this.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        field: this._field.name,
                        value: type === 'checkbox' ? event.target.checked : value
                    }
                })
            );
        }
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

    _getInputField() {
        return this.template.querySelector('lightning-input, lightning-combobox, lightning-textarea');
    }

    _setFieldOptions() {
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
            this._comboboxOptions = JSON.parse(options);
        } catch (error) {
            throw new Error(`Error while fetching lookup options: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async _setPicklistOptions({ sobject, field }) {
        try {
            const options = await getMetadataCombobox({ sObjectName: sobject, fieldName: field });
            this._comboboxOptions = JSON.parse(options);
        } catch (error) {
            throw new Error(`Error while fetching picklist options: ${JSON.stringify(error, null, 2)}`);
        }
    }
}