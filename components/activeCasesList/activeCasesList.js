import { LightningElement } from 'lwc';
import CONTEXT_USER_ID from '@salesforce/user/Id';
import { Query, formatValue, Paginator } from 'c/lib';

import CASE_SOBJECT from '@salesforce/schema/Case';
import CASE_ID from '@salesforce/schema/Case.Id';
import CASE_CREATED_BY_ID from '@salesforce/schema/Case.CreatedById';
import CASE_SUBJECT from '@salesforce/schema/Case.Subject';
import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import CASE_STATUS from '@salesforce/schema/Case.Status';
import CASE_CREATED_DATE from '@salesforce/schema/Case.CreatedDate';

const CASE = {
    SOBJECT: CASE_SOBJECT.objectApiName,
    ID: CASE_ID.fieldApiName,
    CREATED_BY_ID: CASE_CREATED_BY_ID.fieldApiName,
    SUBJECT: CASE_SUBJECT.fieldApiName,
    CASE_NUMBER: CASE_NUMBER.fieldApiName,
    STATUS: CASE_STATUS.fieldApiName,
    CREATED_DATE: CASE_CREATED_DATE.fieldApiName
};

export default class ActiveCasesList extends LightningElement {
    _cases;

    get cases() {
        return new Query()
            .select([CASE.ID, CASE.SUBJECT, CASE.CASE_NUMBER, CASE.STATUS, CASE.CREATED_DATE])
            .from(CASE.SOBJECT)
            .where([CASE.CREATED_BY_ID, '=', CONTEXT_USER_ID])
            .andWhere([CASE.STATUS, 'NOT IN', ['Closed', 'Completed']])
            .orderBy([CASE.CREATED_DATE, 'DESC'])
            .submit();
    }

    get hasCases() {
        return this._cases && this._cases?.length > 0;
    }

    get myCases() {
        return this._cases?.map((myCase) => ({
            id: formatValue({ field: CASE.ID, record: myCase }),
            number: formatValue({ field: CASE.CASE_NUMBER, record: myCase }),
            subject: formatValue({ field: CASE.SUBJECT, record: myCase }),
            status: formatValue({ field: CASE.STATUS, record: myCase }),
            createdDate: formatValue({ field: CASE.CREATED_DATE, record: myCase })
        }));
    }

    get hasMultiplePages() {
        return this.pageCount > 1;
    }

    get currentPage() {
        return this._paginator?.currentPage;
    }

    get pageCount() {
        return this._paginator?.totalPages;
    }

    handleJumpToStart() {
        this._cases = this._paginator.first();
    }

    handleNext() {
        this._cases = this._paginator.next();
    }

    handleBack() {
        this._cases = this._paginator.previous();
    }

    handleJumpToEnd() {
        this._cases = this._paginator.last();
    }

    handleResolved(event) {
        const { data: cases } = event.detail;
        this._paginator = new Paginator(cases, 3);
        this._cases = this._paginator.next();
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }
}