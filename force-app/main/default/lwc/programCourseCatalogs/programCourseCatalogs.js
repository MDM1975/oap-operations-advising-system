import { LightningElement, api } from 'lwc';
import { Query, formatRelationshipName, formatValue } from 'c/lib';

import COURSE_CATALOG_SOBJECT from '@salesforce/schema/Course_Catalog__c';
import COURSE_CATALOG_ID from '@salesforce/schema/Course_Catalog__c.Id';
import COURSE_CATALOG_PROGRAM from '@salesforce/schema/Course_Catalog__c.Program__c';
import COURSE_CATALOG_TITLE from '@salesforce/schema/Course_Catalog__c.Course_Catalog_Title__c';
import COURSE_CATALOG_ACADEMIC_YEAR from '@salesforce/schema/Course_Catalog__c.Academic_Year__c';

import COURSE_CATALOG_REQUIRED_COURSE_SOBJECT from '@salesforce/schema/Course_Catalog_Required_Course__c';
import COURSE_CATALOG_REQUIRED_COURSE_COURSE from '@salesforce/schema/Course_Catalog_Required_Course__c.Course__c';
import COURSE_CATALOG_REQUIRED_COURSE_COURSE_NAME from '@salesforce/schema/Course_Catalog_Required_Course__c.Course__r.Name';

import COURSE_CATALOG_ELECTIVE_COURSE_SOBJECT from '@salesforce/schema/Course_Catalog_Elective_Course__c';
import COURSE_CATALOG_ELECTIVE_COURSE_COURSE from '@salesforce/schema/Course_Catalog_Elective_Course__c.Course__c';
import COURSE_CATALOG_ELECTIVE_COURSE_COURSE_NAME from '@salesforce/schema/Course_Catalog_Elective_Course__c.Course__r.Name';

const COURSE_CATALOG = {
    SOBJECT: COURSE_CATALOG_SOBJECT.objectApiName,
    ID: COURSE_CATALOG_ID.fieldApiName,
    PROGRAM: COURSE_CATALOG_PROGRAM.fieldApiName,
    TITLE: COURSE_CATALOG_TITLE.fieldApiName,
    ACADEMIC_YEAR: COURSE_CATALOG_ACADEMIC_YEAR.fieldApiName
};

const COURSE_CATALOG_REQUIRED_COURSE = {
    SOBJECT: formatRelationshipName({ sobject: COURSE_CATALOG_REQUIRED_COURSE_SOBJECT.objectApiName }),
    COURSE: COURSE_CATALOG_REQUIRED_COURSE_COURSE.fieldApiName,
    COURSE_NAME: COURSE_CATALOG_REQUIRED_COURSE_COURSE_NAME.fieldApiName
};

const COURSE_CATALOG_ELECTIVE_COURSE = {
    SOBJECT: formatRelationshipName({ sobject: COURSE_CATALOG_ELECTIVE_COURSE_SOBJECT.objectApiName }),
    COURSE: COURSE_CATALOG_ELECTIVE_COURSE_COURSE.fieldApiName,
    COURSE_NAME: COURSE_CATALOG_ELECTIVE_COURSE_COURSE_NAME.fieldApiName
};

export default class ProgramCourseCatalogs extends LightningElement {
    @api recordId;
    _courseCatalogs;
    _selectedYear;

    get courseCatalogs() {
        return new Query()
            .select([
                COURSE_CATALOG.ID,
                COURSE_CATALOG.TITLE,
                COURSE_CATALOG.ACADEMIC_YEAR,
                new Query()
                    .select([COURSE_CATALOG_REQUIRED_COURSE.COURSE, COURSE_CATALOG_REQUIRED_COURSE.COURSE_NAME])
                    .from(COURSE_CATALOG_REQUIRED_COURSE.SOBJECT),
                new Query()
                    .select([COURSE_CATALOG_ELECTIVE_COURSE.COURSE, COURSE_CATALOG_ELECTIVE_COURSE.COURSE_NAME])
                    .from(COURSE_CATALOG_ELECTIVE_COURSE.SOBJECT)
            ])
            .from(COURSE_CATALOG.SOBJECT)
            .where([COURSE_CATALOG.PROGRAM, '=', this.recordId])
            .orderBy([COURSE_CATALOG.ACADEMIC_YEAR, 'DESC'])
            .submit();
    }

    get title() {
        return this.courseCatalog?.title;
    }

    get hasCourseCatalogs() {
        return this._courseCatalogs && this._courseCatalogs.length > 0;
    }

    get courseCatalog() {
        if (!this._selectedYear && this.hasCourseCatalogs) {
            this._selectedYear = this._courseCatalogs[0]?.year;
        }

        return this._courseCatalogs?.find((courseCatalog) => courseCatalog.year === this._selectedYear);
    }

    get hasRequiredCourses() {
        return this.courseCatalog?.requiredCourses && this.courseCatalog.requiredCourses?.length > 0;
    }

    get hasElectiveCourses() {
        return this.courseCatalog?.electiveCourses && this.courseCatalog.electiveCourses?.length > 0;
    }

    get courseCatalogOptions() {
        return this._courseCatalogs?.map((courseCatalog) => ({
            label: courseCatalog.title,
            value: courseCatalog.year
        }));
    }

    handleResolved(event) {
        const { data } = event.detail;
        this._courseCatalogs = data?.map((courseCatalog) => ({
            id: formatValue({ field: COURSE_CATALOG.ID, record: courseCatalog }),
            year: formatValue({ field: COURSE_CATALOG.ACADEMIC_YEAR, record: courseCatalog }),
            title: formatValue({ field: COURSE_CATALOG.TITLE, record: courseCatalog }),
            requiredCourses: courseCatalog?.[COURSE_CATALOG_REQUIRED_COURSE.SOBJECT]?.map((requiredCourse) => ({
                id: formatValue({
                    field: COURSE_CATALOG_REQUIRED_COURSE.COURSE,
                    record: requiredCourse
                }),
                url: {
                    page: 'course',
                    label:
                        formatValue({
                            field: COURSE_CATALOG_REQUIRED_COURSE.COURSE_NAME,
                            record: requiredCourse
                        }) ?? '',
                    recordId:
                        formatValue({
                            field: COURSE_CATALOG_REQUIRED_COURSE.COURSE,
                            record: requiredCourse
                        }) ?? ''
                }
            })),
            electiveCourses: courseCatalog?.[COURSE_CATALOG_ELECTIVE_COURSE.SOBJECT]?.map((electiveCourse) => ({
                id: formatValue({
                    field: COURSE_CATALOG_ELECTIVE_COURSE.COURSE,
                    record: electiveCourse
                }),
                url: {
                    page: 'course',
                    label:
                        formatValue({
                            field: COURSE_CATALOG_ELECTIVE_COURSE.COURSE_NAME,
                            record: electiveCourse
                        }) ?? '',
                    recordId:
                        formatValue({
                            field: COURSE_CATALOG_ELECTIVE_COURSE.COURSE,
                            record: electiveCourse
                        }) ?? ''
                }
            }))
        }));
    }

    handleRejected(event) {
        const { error } = event.detail;
        console.error(JSON.stringify(error, null, 2));
    }

    handleSelect(event) {
        this._selectedYear = event.detail.value;
    }
}