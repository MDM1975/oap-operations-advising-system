public class CaseDirector {
    private final SObjectBuilder builder;

    public CaseDirector(SObjectBuilder builder) {
        this.builder = builder;
    }

    public void buildProgramEnrollmentCase(Contact student) {
        this.builder
            .setField(
                Case.Subject.getDescribe().getName(),
                String.format(
                    'Program Enrollment Case for {0} {1}',
                    new List<String>{ student.FirstName, student.LastName }
                )
            )
            .setField(Case.Student__c.getDescribe().getName(), student.Id)
            .setField(Case.Program__c.getDescribe().getName(), student.Primary_Program__c)
            .setField(Case.OwnerId.getDescribe().getName(), student.OwnerId)
            .setField(
                Case.RecordTypeId.getDescribe().getName(),
                MetadataRepository.getRecordTypeMetadata(
                        Case.SObjectType.getDescribe().getName(),
                        'Program Enrollment'
                    )
                    .getRecordTypeId()
            );
    }

    public Case getCase() {
        return (Case) this.builder.getSObject();
    }
}