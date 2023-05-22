public class CourseCatalogTriggerManager extends TriggerManager {
    public CourseCatalogTriggerManager(TriggerState context) {
        super(context);
    }

    public override void manageAfterInsert(TriggerState.RecordIterator iterator) {
        for (TriggerState.Record record : iterator.toList()) {
            Map<String, Object> courseCatalogCopy = new CourseCatalogCopyHandler().execute(record);

            for (
                Course_Catalog_Required_Course__c requiredCourse : (List<Course_Catalog_Required_Course__c>) courseCatalogCopy.get(
                    'requiredCourses'
                )
            ) {
                super.addRelatedRecord(requiredCourse);
            }

            for (
                Course_Catalog_Elective_Course__c electiveCourse : (List<Course_Catalog_Elective_Course__c>) courseCatalogCopy.get(
                    'electiveCourses'
                )
            ) {
                super.addRelatedRecord(electiveCourse);
            }
        }

        super.saveRecords();
    }
}