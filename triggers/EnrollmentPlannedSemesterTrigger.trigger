trigger EnrollmentPlannedSemesterTrigger on Enrollment_Planned_Semester__c(before delete) {
    if (
        [SELECT DisableTriggers__c FROM OrgSettings__mdt WHERE DeveloperName = 'Trigger_Settings']
        ?.DisableTriggers__c != true
    ) {
        List<Enrollment_Planned_Course__c> plannedCourses = [
            SELECT Id
            FROM Enrollment_Planned_Course__c
            WHERE Enrollment_Planned_Semester__c IN :Trigger.oldMap.keySet()
        ];

        if (!plannedCourses.isEmpty()) {
            Database.delete(plannedCourses);
        }
    }
}
