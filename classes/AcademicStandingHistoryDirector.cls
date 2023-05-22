public class AcademicStandingHistoryDirector {
    private final SObjectBuilder builder;

    public AcademicStandingHistoryDirector(SObjectBuilder builder) {
        this.builder = builder;
    }

    public void buildAcademicStandingHistory(
        Id programEnrollmentId,
        String oldAcademicStanding,
        String newAcademicStanding
    ) {
        this.builder
            .setField(
                Academic_Standing_History__c.Program_Enrollment__c.getDescribe().getName(),
                programEnrollmentId
            )
            .setField(
                Academic_Standing_History__c.Old_Academic_Standing__c.getDescribe().getName(),
                oldAcademicStanding
            )
            .setField(
                Academic_Standing_History__c.New_Academic_Standing__c.getDescribe().getName(),
                newAcademicStanding
            )
            .setField(Academic_Standing_History__c.Change_Date__c.getDescribe().getName(), System.today());
    }

    public Academic_Standing_History__c getAcademicStandingHistory() {
        return (Academic_Standing_History__c) this.builder.getSObject();
    }
}