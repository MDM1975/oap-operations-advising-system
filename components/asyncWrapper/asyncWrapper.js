import { LightningElement, api } from 'lwc';

export default class AsyncWrapper extends LightningElement {
    @api promise;
    _data;
    _error;

    get resolved() {
        return this._data && !this._error;
    }

    get rejected() {
        return this._error && !this._data;
    }

    get errorMessage() {
        return this._error?.body?.message;
    }

    async connectedCallback() {
        try {
            this._data = this.promise instanceof Array ? await Promise.all(this.promise) : await this.promise;
            this.dispatchEvent(new CustomEvent('resolved', { detail: { data: this._data } }));
        } catch (error) {
            this._error = error;
            console.error(JSON.stringify(error, null, 2));
            this.dispatchEvent(new CustomEvent('rejected', { detail: { error: this._error } }));
        }
    }
}