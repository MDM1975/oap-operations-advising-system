public class AcademicStandingHandler implements ITriggerHandler {
    public Academic_Standing_History__c execute(TriggerState.Record record) {
        SObjectBuilder builder = new SObjectBuilder(Academic_Standing_History__c.getSObjectType());
        AcademicStandingHistoryDirector director = new AcademicStandingHistoryDirector(builder);

        director.buildAcademicStandingHistory(
            (Id) record.getRecord().get(Program_Enrollment__c.Id),
            (String) record.getRecordPrior().get(Program_Enrollment__c.Academic_Standing__c),
            (String) record.getRecord().get(Program_Enrollment__c.Academic_Standing__c)
        );

        return director.getAcademicStandingHistory();
    }
}