public class AccountDirector {
    private final SObjectBuilder builder;

    public AccountDirector(SObjectBuilder builder) {
        this.builder = builder;
    }

    public void buildPersonalAccount(Contact contact) {
        this.builder
            .setField(
                Account.Name.getDescribe().getName(),
                String.format(
                    '{0} {1}\'s Personal Account',
                    new List<String>{ contact.FirstName, contact.LastName }
                )
            )
            .setField(Account.AccountNumber.getDescribe().getName(), contact.University_Id__c)
            .setField(
                Account.RecordTypeId.getDescribe().getName(),
                MetadataRepository.getRecordTypeMetadata(
                        Account.SObjectType.getDescribe().getName(),
                        'Personal Account'
                    )
                    .getRecordTypeId()
            );
    }

    public Account getAccount() {
        return (Account) this.builder.getSObject();
    }
}