import getQuery from '@salesforce/apex/UiDataService.query';

export class Query {
    constructor() {
        this._fields = [];
        this._sObject = '';
        this._conditions = [];
        this._groupBy = '';
        this._order = '';
        this._limit = 0;
    }

    select(fields) {
        return !fields || fields.length === 0 ? this : this._addFields(fields);
    }

    from(sObject) {
        this._sObject = sObject;
        return this;
    }

    where(condition) {
        return !condition || condition.length !== 3 ? this : this._addCondition(condition);
    }

    andWhere(condition) {
        return !condition || condition.length !== 3 ? this : this._addCondition(condition, 'AND');
    }

    orWhere(condition) {
        return !condition || condition.length !== 3 ? this : this._addCondition(condition, 'OR');
    }

    groupBy(fields) {
        return !fields || fields.length === 0 ? this : this._addGroupBy(fields);
    }

    orderBy(order) {
        return !order || order.length !== 2 ? this : this._addOrder(order);
    }

    limit(limit) {
        this._limit = limit;
        return this;
    }

    submit() {
        try {
            return getQuery({ query: JSON.stringify({ query: this._toSOQL() }) });
        } catch (error) {
            throw new Error(`Error in Submitting Query: ${JSON.stringify(error, null, 4)}`);
        }
    }

    _toSOQL() {
        return `SELECT ${this._fields.join(', ')} FROM ${this._sObject} ${
            this._conditions.length ? `WHERE ${this._conditions.join(' ')}` : ''
        } ${this._groupBy ? `GROUP BY ${this._groupBy}` : ''} ${this._order ? `ORDER BY ${this._order}` : ''} ${
            this._limit ? `LIMIT ${this._limit}` : ''
        }`;
    }

    _addFields(fields) {
        this._fields = fields.map((field) => {
            return field instanceof Query ? `(${field._toSOQL().trimEnd()})` : field;
        });
        return this;
    }

    _addCondition(condition, logicalOperator) {
        const [field, comparisonOperator, value] = condition;
        const formattedValue = this._formatValue(value);
        this._conditions.push(
            `${logicalOperator ? `${logicalOperator} ` : ''} ${field} ${comparisonOperator} ${formattedValue}`
        );
        return this;
    }

    _addGroupBy(fields) {
        this._groupBy = fields.join(', ');
        return this;
    }

    _addOrder(order) {
        this._order = order.every((clause) => clause instanceof Array)
            ? order.map((clause) => `${clause[0]} ${clause[1]}`).join(', ')
            : `${order[0]} ${order[1]}`;
        return this;
    }

    _formatValue(value) {
        switch (true) {
            case /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.test(value):
                return value.replace(/'/g, '');
            case value instanceof Array:
                return `(${value.map((item) => `'${item}'`).join(', ')})`;
            case value instanceof Query:
                return `(${value._toSOQL().trimEnd()})`;
            case typeof value === 'string':
                return value.startsWith("'") && value.endsWith("'") ? value : `'${value}'`;
            default:
                return value;
        }
    }
}
