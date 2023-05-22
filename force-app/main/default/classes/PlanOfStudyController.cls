public class PlanOfStudyController {
    @AuraEnabled
    public static Id getProgramEnrollmentId(Id studentId) {
        return [
            SELECT Id
            FROM Program_Enrollment__c
            WHERE Student__c = :studentId AND Enrollment_Status__c != 'Graduated'
            ORDER BY CreatedDate DESC
            LIMIT 1
        ]
        ?.Id;
    }

    @AuraEnabled
    public static Map<String, Object> getProgramEnrollmentProgress(Id studentId) {
        Double totalCredits = 0;
        Double creditsEarned = 0;

        AggregateResult appliedEnrollmentCredits = [
            SELECT SUM(Course__r.Credit_Hours__c) credits
            FROM Enrollment_Planned_Course__c
            WHERE Enrollment_Planned_Semester__r.Program_Enrollment__r.Student__c = :studentId
        ];

        Double programRequiredCredits = [
            SELECT Program_Enrollment__c.Program__r.Total_Credits__c
            FROM Program_Enrollment__c
            WHERE Student__c = :studentId
            ORDER BY CreatedDate DESC
            LIMIT 1
        ]
        ?.Program__r.Total_Credits__c;

        if (programRequiredCredits != null) {
            totalCredits = programRequiredCredits;
        }

        if (appliedEnrollmentCredits?.get('credits') != null) {
            creditsEarned = (Double) appliedEnrollmentCredits?.get('credits');
        }

        return new Map<String, Object>{
            'totalCredits' => totalCredits,
            'creditsEarned' => appliedEnrollmentCredits?.get('credits'),
            'creditsRemaining' => totalCredits - creditsEarned
        };
    }

    @AuraEnabled
    public static List<Enrollment_Planned_Semester__c> getPlannedSemesters(Id studentId) {
        return [
            SELECT Id, Semester__r.Semester_Title__c, Semester__r.Start_Date__c
            FROM Enrollment_Planned_Semester__c
            WHERE Program_Enrollment__r.Student__c = :studentId
            ORDER BY Semester__r.Start_Date__c ASC, Semester__r.Academic_Year__c ASC, Semester__r.Part_of_Term__c ASC
        ];
    }

    @AuraEnabled
    public static Enrollment_Planned_Semester__c getPlannedSemesterDetails(Id plannedSemesterId) {
        return [
            SELECT Semester__r.Part_of_Term__c, Semester__r.Start_Date__c, Semester__r.End_Date__c, Planned_Off__c
            FROM Enrollment_Planned_Semester__c
            WHERE Id = :plannedSemesterId
        ];
    }

    @AuraEnabled
    public static List<Enrollment_Planned_Course__c> getPlannedCourses(Id plannedSemesterId) {
        return [
            SELECT Course__c, Course__r.Course_Title__c
            FROM Enrollment_Planned_Course__c
            WHERE Enrollment_Planned_Semester__c = :plannedSemesterId
        ];
    }

    @AuraEnabled
    public static List<Semester__c> getFutureSemesterOptions(Id studentId) {
        return [
            SELECT Id, Semester_Title__c
            FROM Semester__c
            WHERE
                Start_Date__c > TODAY
                AND Id NOT IN (
                    SELECT Semester__c
                    FROM Enrollment_Planned_Semester__c
                    WHERE Program_Enrollment__r.Student__c = :studentId
                )
            ORDER BY Start_Date__c ASC, Academic_Year__c ASC, Part_of_Term__c ASC
        ];
    }

    @AuraEnabled
    public static List<Course_Catalog_Required_Course__c> getRequiredCourseOptions(Id plannedSemesterId) {
        return [
            SELECT Id, Course__c, Course__r.Name
            FROM Course_Catalog_Required_Course__c
            WHERE
                Course_Catalog__c IN (
                    SELECT Course_Catalog__c
                    FROM Program_Enrollment__c
                    WHERE Id = :getSemesterProgramEnrollmentId(plannedSemesterId)
                )
                AND Course__c IN (
                    SELECT Course__c
                    FROM Semester_Session_Course_Offering__c
                    WHERE Semester_Session__c = :getSemesterSessionId(plannedSemesterId)
                )
                AND Course__c NOT IN :getPlannedCourseIds(plannedSemesterId)
        ];
    }

    @AuraEnabled
    public static List<Course_Catalog_Elective_Course__c> getElectiveCourseOptions(Id plannedSemesterId) {
        return [
            SELECT Id, Course__c, Course__r.Name
            FROM Course_Catalog_Elective_Course__c
            WHERE
                Course_Catalog__c IN (
                    SELECT Course_Catalog__c
                    FROM Program_Enrollment__c
                    WHERE Id = :getSemesterProgramEnrollmentId(plannedSemesterId)
                )
                AND Course__c IN (
                    SELECT Course__c
                    FROM Semester_Session_Course_Offering__c
                    WHERE Semester_Session__c = :getSemesterSessionId(plannedSemesterId)
                )
                AND Course__c NOT IN :getPlannedCourseIds(plannedSemesterId)
        ];
    }

    @AuraEnabled
    public static List<Course__c> getSpecialCourseOptions() {
        return [
            SELECT Id, Name
            FROM Course__c
            WHERE Name IN ('TBD 999', 'TRN 999')
        ];
    }

    private static Id getSemesterProgramEnrollmentId(Id plannedSemesterId) {
        return [
            SELECT Program_Enrollment__c
            FROM Enrollment_Planned_Semester__c
            WHERE Id = :plannedSemesterId
        ]
        ?.Program_Enrollment__c;
    }

    private static Id getSemesterSessionId(Id plannedSemesterId) {
        return [
            SELECT Semester__r.Semester_Session__c
            FROM Enrollment_Planned_Semester__c
            WHERE Id = :plannedSemesterId
        ]
        ?.Semester__r.Semester_Session__c;
    }

    private static Set<Id> getPlannedCourseIds(Id plannedSemesterId) {
        Set<Id> plannedCourseIds = new Set<Id>();
        Id programEnrollmentId = getSemesterProgramEnrollmentId(plannedSemesterId);

        for (Enrollment_Planned_Course__c plannedCourse : [
            SELECT Course__c
            FROM Enrollment_Planned_Course__c
            WHERE Enrollment_Planned_Semester__r.Program_Enrollment__c = :programEnrollmentId
        ]) {
            plannedCourseIds.add(plannedCourse.Course__c);
        }

        return plannedCourseIds;
    }
}