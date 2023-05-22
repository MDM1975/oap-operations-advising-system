import { LightningElement, api } from 'lwc';

const TITLES = {
    success: 'Success',
    error: 'Error'
};

export default class ToastNotification extends LightningElement {
    _message = '';
    _type = '';
    _duration = 3000;

    get title() {
        return TITLES[this._type] ?? '';
    }

    get message() {
        return this._message;
    }

    get style() {
        return this._type ? `toast-${this._type}` : '';
    }

    get isVisible() {
        return this._isVisible;
    }

    get isSuccess() {
        return this._type === 'success';
    }

    get isError() {
        return this._type === 'error';
    }

    @api dispatch({ type, message, duration = 3000 }) {
        if (this._isVisible) {
            this._hide();
        }

        this._type = type;
        this._message = message;
        this._duration = duration;

        this._show();
    }

    _show() {
        const container = this.template.querySelector('.toast-container');
        container.classList.add(this.style);
        container.classList.add('visible');
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this._hide();
        }, this._duration);
    }

    _hide() {
        const container = this.template.querySelector('.toast-container');
        container.classList.remove(this.style);
        container.classList.remove('visible');
    }

    hide() {
        this._hide();
    }
}