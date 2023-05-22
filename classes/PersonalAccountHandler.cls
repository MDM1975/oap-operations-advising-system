public class PersonalAccountHandler implements ITriggerHandler {
    public Account execute(TriggerState.Record record) {
        SObjectBuilder builder = new SObjectBuilder(Account.getSObjectType());
        AccountDirector director = new AccountDirector(builder);
        director.buildPersonalAccount((Contact) record.getRecord());

        return director.getAccount();
    }
}