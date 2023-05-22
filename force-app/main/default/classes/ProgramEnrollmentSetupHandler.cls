public class ProgramEnrollmentSetupHandler implements ITriggerHandler {
    public Map<String, SObject> execute(TriggerState.Record record) {
        record.getRecord().put(Program_Enrollment__c.Enrollment_Status__c, 'Enrolled');
        record.getRecord().put(Program_Enrollment__c.Academic_Standing__c, 'Good Standing');

        Id courseCatalogId = getCourseCatalogId((Program_Enrollment__c) record.getRecord());
        if (courseCatalogId != null) {
            record.getRecord().put(Program_Enrollment__c.Course_Catalog__c, courseCatalogId);
        }

        Case programEnrollmentCase = getRelatedCase((Program_Enrollment__c) record.getRecord());
        if (programEnrollmentCase != null) {
            programEnrollmentCase.Status = 'Completed';
        }

        return new Map<String, SObject>{
            'programEnrollment' => record.getRecord(),
            'case' => programEnrollmentCase
        };
    }

    private Id getCourseCatalogId(Program_Enrollment__c programEnrollment) {
        return [
            SELECT Id
            FROM Course_Catalog__c
            WHERE Program__c = :programEnrollment.Program__c
        ]
        ?.Id;
    }

    public Case getRelatedCase(Program_Enrollment__c programEnrollment) {
        Case programEnrollmentCase = [
            SELECT Id
            FROM Case
            WHERE Student__c = :programEnrollment.Student__c AND RecordType.Name = 'Program Enrollment'
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];

        return programEnrollmentCase != null ? programEnrollmentCase : new Case();
    }
}