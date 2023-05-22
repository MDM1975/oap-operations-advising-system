import createRecord from '@salesforce/apex/UiDataService.createRecord';
import updateRecord from '@salesforce/apex/UiDataService.updateRecord';
import deleteRecord from '@salesforce/apex/UiDataService.deleteRecord';

/**
 * @class RecordProxy
 * @classdesc This class is used to create, update and delete records.
 */
export class RecordProxy {
    constructor(sObject = '') {
        this._sObject = sObject;
        this._fields = {};
    }

    get sObject() {
        return this._sObject;
    }

    get fields() {
        return this._fields;
    }

    add(name, value) {
        this._fields[name] = value;
        return this;
    }

    insert() {
        try {
            return createRecord({ sObjectName: this._sObject, sObjectJson: JSON.stringify(this._fields) });
        } catch (error) {
            throw new Error(`Error while creating data: ${JSON.stringify(error, null, 4)}`);
        }
    }

    update() {
        try {
            return updateRecord({ sObjectId: this._fields.Id, sObjectJson: JSON.stringify(this._fields) });
        } catch (error) {
            throw new Error(`Error while updating data: ${JSON.stringify(error, null, 4)}`);
        }
    }

    delete() {
        try {
            return deleteRecord({ sObjectId: this._fields.Id });
        } catch (error) {
            throw new Error(`Error while deleting data: ${JSON.stringify(error, null, 4)}`);
        }
    }

    clear() {
        this._fields = {};
    }
}