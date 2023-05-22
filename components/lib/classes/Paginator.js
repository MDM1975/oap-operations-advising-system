/**
 * @class Paginator
 * @classdesc A class that handles pagination of data for a table
 */
export class Paginator {
    /**
     * @constructor
     * @param {Array<object>} data - The data to be paginated
     * @param {number} size - The number of records to be displayed per page
     * @returns {Paginator}
     */
    constructor(data, size) {
        this._data = data;
        this._cache = Object.freeze({ data });
        this._size = size;
        this._total = Math.ceil(data.length / size);
        this._current = 0;
    }

    /**
     * @type {number}
     */
    get currentPage() {
        return this._current;
    }

    /**
     * @type {number}
     */
    get totalPages() {
        return this._total;
    }

    /**
     * @method first - Returns the first page of data
     * @returns {Array<object>}
     */
    first() {
        this._current = 1;
        return this.paginate();
    }

    /**
     * @method last - Returns the last page of data
     * @returns {Array<object>}
     */
    last() {
        this._current = this._total;
        return this.paginate();
    }

    /**
     * @method next - Returns the next page of data
     * @returns {Array<object>}
     */
    next() {
        if (this._current < this._total) {
            this._current++;
        }

        return this.paginate();
    }

    /**
     * @method previous - Returns the previous page of data
     * @returns {Array<object>}
     */
    previous() {
        if (this._current > 1) {
            this._current--;
        }

        return this.paginate();
    }

    /**
     * @method search - Returns the data that matches the search term (This is used exclusively for record tables)
     * @param {string} searchTerm - The search term
     * @returns {Array<object>}
     */
    search(searchTerm) {
        this._data = !searchTerm
            ? this._cache.data
            : this._cache.data.filter((row) => {
                  return row.cells.some((cell) => {
                      return cell.value
                          ? String(cell.value).toLowerCase().includes(searchTerm.toLowerCase())
                          : false;
                  });
              });

        this._total = Math.ceil(this._data.length / this._size);
        this._current = 1;
        return this.paginate();
    }

    /**
     * @method paginate - Returns the current page of data
     * @returns {Array<object>}
     */
    paginate() {
        const start = (Number(this._current) - 1) * Number(this._size);
        const end = Number(start) + Number(this._size);
        return this._data.slice(start, end);
    }
}