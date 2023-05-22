import { LightningElement, api } from 'lwc';
import { Paginator, formatValue } from 'c/lib';

export default class RecordTable extends LightningElement {
    @api title;
    @api records;
    @api columns;
    @api size = 25;
    @api withSearch;
    _paginator;
    _rows;

    get hasSearch() {
        return this.withSearch === 'true' ? true : false;
    }

    get hasRows() {
        return this._rows && this._rows.length > 0;
    }

    get rows() {
        return this._rows;
    }

    get columnStyle() {
        return `slds-col slds-truncate slds-p-left_small slds-size_1-of-${this.columns?.length}`;
    }

    get cellStyle() {
        return `cell-value slds-col slds-border_top slds-truncate slds-p-left_small slds-size_1-of-${this.columns?.length}`;
    }

    get currentPage() {
        return this._paginator?.currentPage;
    }

    get pageCount() {
        return this._paginator?.totalPages;
    }

    get hasMultiplePages() {
        return this._paginator?.totalPages > 1;
    }

    handleResolved(event) {
        const { data } = event.detail;
        const records = data.map((record) => ({
            id: record.Id,
            cells: this.columns.map((column) => ({
                name: column.name,
                value: formatValue({ field: column, record }),
                url: column.url
                    ? {
                          page: column.url.page,
                          label: formatValue({ field: column, record }) ?? '',
                          recordId: formatValue({ field: column.url.param, record }) ?? ''
                      }
                    : null
            }))
        }));

        this._paginator = new Paginator(records, this.size);
        this._rows = this._paginator.next();
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(error);
    }

    handleJumpToStart() {
        this._rows = this._paginator.first();
    }

    handleNext() {
        this._rows = this._paginator.next();
    }

    handleBack() {
        this._rows = this._paginator.previous();
    }

    handleJumpToEnd() {
        this._rows = this._paginator.last();
    }

    handleSearch(event) {
        const { value } = event.target;
        this._rows = this._paginator.search(value);
    }
}