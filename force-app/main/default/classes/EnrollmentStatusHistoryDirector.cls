public class EnrollmentStatusHistoryDirector {
    private final SObjectBuilder builder;

    public EnrollmentStatusHistoryDirector(SObjectBuilder builder) {
        this.builder = builder;
    }

    public void buildEnrollmentStatusHistory(
        Id programEnrollmentId,
        String oldEnrollmentStatus,
        String newEnrollmentStatus
    ) {
        this.builder
            .setField(
                Enrollment_Status_History__c.Program_Enrollment__c.getDescribe().getName(),
                programEnrollmentId
            )
            .setField(
                Enrollment_Status_History__c.Old_Enrollment_Status__c.getDescribe().getName(),
                oldEnrollmentStatus
            )
            .setField(
                Enrollment_Status_History__c.New_Enrollment_Status__c.getDescribe().getName(),
                newEnrollmentStatus
            )
            .setField(Enrollment_Status_History__c.Change_Date__c.getDescribe().getName(), System.today());
    }

    public Enrollment_Status_History__c getEnrollmentStatusHistory() {
        return (Enrollment_Status_History__c) this.builder.getSObject();
    }
}