public class EnrollmentStatusHandler implements ITriggerHandler {
    public Enrollment_Status_History__c execute(TriggerState.Record record) {
        SObjectBuilder builder = new SObjectBuilder(Enrollment_Status_History__c.getSObjectType());
        EnrollmentStatusHistoryDirector director = new EnrollmentStatusHistoryDirector(builder);

        director.buildEnrollmentStatusHistory(
            (Id) record.getRecord().get(Program_Enrollment__c.Id),
            (String) record.getRecordPrior().get(Program_Enrollment__c.Enrollment_Status__c),
            (String) record.getRecord().get(Program_Enrollment__c.Enrollment_Status__c)
        );

        return director.getEnrollmentStatusHistory();
    }
}