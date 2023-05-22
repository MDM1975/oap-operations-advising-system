import COMMUNITY_PATH from '@salesforce/community/basePath';
export { formatValue, formatUrl, formatRelationshipName, formatLookupField };

/**
 * @param {object} field - field object
 * @param {object} record - record object
 * @returns {string} - formatted value
 * @description - function that formats a value based on the field type
 */
function formatValue({ field, record }) {
    const value = getValue(field, record);
    switch (field.type) {
        case 'date':
            return getDateValue(value);
        case 'checkbox':
            return getCheckboxValue(value);
        default:
            return value;
    }
}

/**
 * @param {string} path - path to the record
 * @param {string} param - parameter to use for the record id
 * @param {object} record - record object
 * @returns {string} - formatted url
 * @description - function that formats a url for a record
 */
function formatUrl({ path, param, record }) {
    return `${COMMUNITY_PATH}/${path}/${record[param] ?? ''}`;
}

/**
 * @param {string} sobject - sobject name
 * @returns {string} - formatted sobject name for a relationship
 * @description - function that formats a sobject name for a relationship (plural and with __r suffix)
 */
function formatRelationshipName({ sobject }) {
    return String(sobject).replace(/__c/g, 's__r');
}

/**
 * @param {object} field - field object
 * @returns {string} - formatted field name
 * @description - function that formats a lookup field based on the current field suffix (__c or __r) and swaps it with the opposite suffix
 */
function formatLookupField({ field }) {
    return /__r\..*/.test(field) ? String(field).replace(/__r\..*/, '__c') : String(field).replace(/__c/g, '__r');
}

// --------------------------------------------------------------------------------------
// ---------------------------------- Helper functions ----------------------------------
// --------------------------------------------------------------------------------------

/**
 * @param {string|object} field - field name or field object
 * @param {object} record - record object
 * @returns {string} - value
 * @description - function that gets the value of a field from a record
 */
function getValue(field, record) {
    if (typeof field === 'object') {
        const { name } = field;
        const [relationship, fieldName] = name.includes('.') ? name.split('.') : [null, null];
        return relationship && fieldName ? record?.[relationship]?.[fieldName] : record?.[name];
    }

    const [relationship, fieldName] = field.includes('.') ? field.split('.') : [null, null];
    return relationship && fieldName ? record?.[relationship]?.[fieldName] : record?.[field];
}

/**
 * @param {string} value - date value
 * @returns {string} - formatted date value
 * @description - function that formats a date value
 */
function getDateValue(value) {
    if (!value) {
        return '';
    }

    if (/Z$/.test(value)) {
        return new Date(value).toLocaleDateString();
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString();
}

/**
 * @param {boolean} value - checkbox value
 * @returns {string} - formatted checkbox value
 * @description - function that formats a checkbox value
 */
function getCheckboxValue(value) {
    return value ? 'Yes' : 'No';
}