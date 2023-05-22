import { LightningElement, api } from 'lwc';
import { Query, formatValue } from 'c/lib';

export default class RecordDetailCard extends LightningElement {
    @api title;
    @api sObject;
    @api recordId;
    @api filterBy;
    @api fields;
    _details;

    get record() {
        return new Query()
            .select(this.fields.map(({ name }) => name))
            .from(this.sObject)
            .where([this.filterBy.field, this.filterBy.operator, this.filterBy.value])
            .orderBy(['CreatedDate', 'desc'])
            .limit(1)
            .submit();
    }

    get hasDetails() {
        return this._details && this._details.length > 0;
    }

    get details() {
        return this._details;
    }

    get size() {
        return `slds-col slds-p-top_small slds-size_1-of-${this.fields.length <= 2 ? '1' : '2'}`;
    }

    handleResolved(event) {
        const [record] = event.detail.data;
        if (record) {
            this._details = this.fields.map((field) => ({
                field,
                record,
                value: formatValue({ field, record }),
                url: field.url
                    ? {
                          page: field.url.page,
                          label: formatValue({ field, record }) ?? '',
                          recordId: formatValue({ field: field.url.param, record }) ?? ''
                      }
                    : null
            }));
        }
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(JSON.stringify(error, null, 2));
    }
}