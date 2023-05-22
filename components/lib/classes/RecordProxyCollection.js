import createRecords from '@salesforce/apex/UiDataService.createRecords';

export class RecordProxyCollection {
    constructor(sObject = '') {
        this._sObject = sObject;
        this._records = [];
    }

    get records() {
        return this._records;
    }

    has(field, value) {
        return this._records.some((record) => record?.[field] === value);
    }

    remove(field, value) {
        this._records = this._records.filter((record) => !(record?.[field] === value));
    }

    add(proxy) {
        this._records.push(proxy);
    }

    applyToEach(field, value) {
        this._records.forEach((record) => record.add(field, value));
    }

    insert() {
        try {
            createRecords({
                sObjectName: this._sObject,
                sObjectsJson: JSON.stringify(this.records.map((record) => record.fields))
            });
        } catch (error) {
            throw new Error(`Error while creating data: ${JSON.stringify(error, null, 4)}`);
        }
    }
}