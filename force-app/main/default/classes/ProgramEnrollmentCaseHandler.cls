public class ProgramEnrollmentCaseHandler implements ITriggerHandler {
    public Case execute(TriggerState.Record record) {
        SObjectBuilder builder = new SObjectBuilder(Case.getSObjectType());
        CaseDirector director = new CaseDirector(builder);
        director.buildProgramEnrollmentCase((Contact) record.getRecord());

        return director.getCase();
    }
}