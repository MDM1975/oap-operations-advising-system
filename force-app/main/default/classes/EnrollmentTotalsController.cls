public class EnrollmentTotalsController {
    @AuraEnabled
    public static List<Map<String, Map<String, Object>>> getEnrollmentTotals() {
        Map<Id, SObject> courses = new Map<Id, SObject>(
            [
                SELECT Id, Name, Total_Capacity__c
                FROM Course__c
            ]
        );

        Map<Id, SObject> semesters = new Map<Id, SObject>(
            [
                SELECT Id, Name, Start_Date__c
                FROM Semester__c
                WHERE Start_Date__c > TODAY
            ]
        );

        List<AggregateResult> plannedCourses = [
            SELECT COUNT(Id) enrollments, Enrollment_Planned_Semester__r.Semester__c semester, Course__c course
            FROM Enrollment_Planned_Course__c
            WHERE
                Course__c != NULL
                AND Enrollment_Planned_Semester__r.Semester__r.Start_Date__c > TODAY
                AND Course__r.Name NOT IN ('TBD 999', 'TRN 999')
            GROUP BY
                Enrollment_Planned_Semester__r.Semester__c,
                Course__c,
                Enrollment_Planned_Semester__r.Semester__r.Start_Date__c
            ORDER BY Enrollment_Planned_Semester__r.Semester__r.Start_Date__c
        ];

        List<Map<String, Map<String, Object>>> enrollmentTotals = new List<Map<String, Map<String, Object>>>();

        for (AggregateResult aggregate : plannedCourses) {
            enrollmentTotals.add(
                new Map<String, Map<String, Object>>{
                    ((Semester__c) semesters.get((Id) aggregate.get('semester'))).Name => new Map<String, Object>{
                        'course' => ((Course__c) courses.get((Id) aggregate.get('course'))).Name,
                        'capacity' => ((Course__c) courses.get((Id) aggregate.get('course'))).Total_Capacity__c,
                        'enrollments' => (Integer) aggregate.get('enrollments')
                    }
                }
            );
        }

        return enrollmentTotals;
    }

    @AuraEnabled
    public static List<Map<String, Map<String, Object>>> getSingleCourseEnrollmentTotals(Id courseId) {
        Course__c course = [
            SELECT Id, Name, Total_Capacity__c
            FROM Course__c
            WHERE Id = :courseId
        ];

        Map<Id, SObject> semesters = new Map<Id, SObject>(
            [
                SELECT Id, Name, Start_Date__c
                FROM Semester__c
                WHERE Start_Date__c > TODAY
            ]
        );

        List<AggregateResult> plannedCourses = [
            SELECT COUNT(Id) enrollments, Enrollment_Planned_Semester__r.Semester__c semester, Course__c course
            FROM Enrollment_Planned_Course__c
            WHERE
                Course__c = :courseId
                AND Enrollment_Planned_Semester__r.Semester__r.Start_Date__c > TODAY
                AND Course__r.Name NOT IN ('TBD 999', 'TRN 999')
            GROUP BY
                Enrollment_Planned_Semester__r.Semester__c,
                Course__c,
                Enrollment_Planned_Semester__r.Semester__r.Start_Date__c
            ORDER BY Enrollment_Planned_Semester__r.Semester__r.Start_Date__c
        ];

        List<Map<String, Map<String, Object>>> enrollmentTotals = new List<Map<String, Map<String, Object>>>();

        for (AggregateResult aggregate : plannedCourses) {
            enrollmentTotals.add(
                new Map<String, Map<String, Object>>{
                    ((Semester__c) semesters.get((Id) aggregate.get('semester'))).Name => new Map<String, Object>{
                        'semester' => ((Semester__c) semesters.get((Id) aggregate.get('semester'))).Name,
                        'capacity' => course.Total_Capacity__c,
                        'enrollments' => (Integer) aggregate.get('enrollments')
                    }
                }
            );
        }

        return enrollmentTotals;
    }
}