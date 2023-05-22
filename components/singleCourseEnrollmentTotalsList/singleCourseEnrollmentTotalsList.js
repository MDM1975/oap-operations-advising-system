import { LightningElement, api } from 'lwc';
import getSingleCourseEnrollmentTotals from '@salesforce/apex/EnrollmentTotalsController.getSingleCourseEnrollmentTotals';

export default class SingleCourseEnrollmentTotalsList extends LightningElement {
    @api recordId;
    _enrollments;

    get totals() {
        const total = this._enrollments?.map((enrollment) => {
            const [key] = Object.keys(enrollment);
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
        });

        return total;
    }

    async connectedCallback() {
        this._enrollments = await getSingleCourseEnrollmentTotals({ courseId: this.recordId });
    }
}