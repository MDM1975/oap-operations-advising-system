import { LightningElement } from 'lwc';
import getEnrollmentTotals from '@salesforce/apex/EnrollmentTotalsController.getEnrollmentTotals';

export default class CourseEnrollmentTotalsList extends LightningElement {
    _enrollments;
    _selectedKey;

    get keys() {
        return new Set(
            this._enrollments?.map((enrollment) => {
                const [key] = Object.keys(enrollment);
                return key;
            })
        );
    }

    get title() {
        return `${this._selectedKey} Enrollment Totals`;
    }

    get totals() {
        const total = this._enrollments
            ?.map((enrollment) => {
                const [key] = Object.keys(enrollment);
                if (key === this._selectedKey) {
                    return {
                        ...enrollment[key],
                        rowStyle: (() => {
                            const { enrollments, capacity } = enrollment[key];
                            if (enrollments >= capacity - 10 && enrollments < capacity - 5) {
                                return 'slds-grid slds-p-vetical_xx-small slds-border_top warning';
                            }

                            if (enrollments >= capacity - 5 || enrollments >= capacity) {
                                return 'slds-grid slds-p-vertical_xx-small slds-border_top error';
                            }

                            return 'slds-grid slds-p-vertical_xx-small slds-border_top';
                        })()
                    };
                }
                return null;
            })
            .filter(Boolean);

        return total;
    }

    async connectedCallback() {
        this._enrollments = await getEnrollmentTotals();
        this._selectedKey = this.keys.values().next().value;
    }

    handleSelect(event) {
        this._selectedKey = event.detail.value;
    }
}