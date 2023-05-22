import { LightningElement, api, wire } from 'lwc';
import { Query, Paginator, formatValue } from 'c/lib';
import { subscribe, MessageContext } from 'lightning/messageService';
import RecordPageStream from '@salesforce/messageChannel/RecordPageStream__c';

export default class RelatedRecordList extends LightningElement {
    @api title;
    @api sObject;
    @api filterBy;
    @api sortBy;
    @api fields;
    @api listSize = 3;
    _items;
    _paginator;

    get records() {
        return new Query()
            .select(this.fields.map(({ name }) => name))
            .from(this.sObject)
            .where(
                this.filterBy
                    ? [`${this.filterBy?.field}`, `${this.filterBy?.operator}`, `${this.filterBy?.value}`]
                    : []
            )
            .orderBy(this.sortBy ? [`${this.sortBy?.field}`, `${this.sortBy?.direction}`] : [])
            .submit();
    }

    get hasRecords() {
        return this._items && this._items?.length > 0;
    }

    get hasMultiplePages() {
        return this.pageCount > 1;
    }

    get items() {
        return this._items;
    }

    get currentPage() {
        return this._paginator?.currentPage;
    }

    get pageCount() {
        return this._paginator?.totalPages;
    }

    get style() {
        return `slds-col slds-p-top_small slds-size_1-of-${this.fields.length === 1 ? '1' : '2'}`;
    }

    @wire(MessageContext) _messageContext;

    connectedCallback() {
        subscribe(this._messageContext, RecordPageStream, () => this.refresh());
    }

    @api async refresh() {
        try {
            const records = await this.records;
            this._paginator = new Paginator(this._formatListItems(records), this.listSize);
            this._items = this._paginator.next();
        } catch (error) {
            console.error(error);
            throw new Error(JSON.stringify(error, null, 2));
        }
    }

    handleResolved(event) {
        const { data: records } = event.detail;
        this._paginator = new Paginator(this._formatListItems(records), this.listSize);
        this._items = this._paginator.next();
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }

    handleJumpToStart() {
        this._items = this._paginator.first();
    }

    handleNext() {
        this._items = this._paginator.next();
    }

    handleBack() {
        this._items = this._paginator.previous();
    }

    handleJumpToEnd() {
        this._items = this._paginator.last();
    }

    _formatListItems(records) {
        return records?.map((record) => ({
            id: record.Id,
            fields: this.fields?.map((field) => ({
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
            }))
        }));
    }
}