public class CourseCatalogCopyHandler implements ITriggerHandler {
    public Map<String, Object> execute(TriggerState.Record record) {
        Map<String, Object> copy = new Map<String, Object>{
            'requiredCourses' => new List<Course_Catalog_Required_Course__c>(),
            'electiveCourses' => new List<Course_Catalog_Elective_Course__c>()
        };

        List<Course_Catalog__c> previousYearCourseCatalog = getPreviousYearCourseCatalog(
            (Course_Catalog__c) record.getRecord()
        );

        if (previousYearCourseCatalog.size() == 0) {
            return null;
        }

        ((List<Course_Catalog_Required_Course__c>) copy.get('requiredCourses'))
            .addAll(
                copyRequiredCourses(
                    previousYearCourseCatalog[0]?.Course_Catalog_Required_Courses__r,
                    record.getRecord().Id
                )
            );

        ((List<Course_Catalog_Elective_Course__c>) copy.get('electiveCourses'))
            .addAll(
                copyElectiveCourses(
                    previousYearCourseCatalog[0]?.Course_Catalog_Elective_Courses__r,
                    record.getRecord().Id
                )
            );

        return copy;
    }

    public List<Course_Catalog_Required_Course__c> copyRequiredCourses(
        List<Course_Catalog_Required_Course__c> requiredCourses,
        Id courseCatalogId
    ) {
        List<Course_Catalog_Required_Course__c> newRequiredCourses = new List<Course_Catalog_Required_Course__c>();
        for (Course_Catalog_Required_Course__c requiredCourse : requiredCourses) {
            newRequiredCourses.add(
                new Course_Catalog_Required_Course__c(
                    Course_Catalog__c = courseCatalogId,
                    Course__c = requiredCourse.Course__c
                )
            );
        }

        return newRequiredCourses;
    }

    public List<Course_Catalog_Elective_Course__c> copyElectiveCourses(
        List<Course_Catalog_Elective_Course__c> electiveCourses,
        Id courseCatalogId
    ) {
        List<Course_Catalog_Elective_Course__c> newElectiveCourses = new List<Course_Catalog_Elective_Course__c>();
        for (Course_Catalog_Elective_Course__c electiveCourse : electiveCourses) {
            newElectiveCourses.add(
                new Course_Catalog_Elective_Course__c(
                    Course_Catalog__c = courseCatalogId,
                    Course__c = electiveCourse.Course__c
                )
            );
        }

        return newElectiveCourses;
    }

    private List<Course_Catalog__c> getPreviousYearCourseCatalog(Course_Catalog__c courseCatalog) {
        return [
            SELECT
                (SELECT Course__c FROM Course_Catalog_Required_Courses__r),
                (SELECT Course__c FROM Course_Catalog_Elective_Courses__r)
            FROM Course_Catalog__c
            WHERE
                Program__c = :courseCatalog.Program__c
                AND Academic_Year__c = :String.valueOf(Integer.valueOf(courseCatalog.Academic_Year__c) - 1)
        ];
    }
}