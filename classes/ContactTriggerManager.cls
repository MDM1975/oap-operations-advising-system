public class ContactTriggerManager extends TriggerManager {
    private List<PersonalAccountContainer> personalAccounts;

    public ContactTriggerManager(TriggerState context) {
        super(context);
        this.personalAccounts = new List<PersonalAccountContainer>();
    }

    public override void manageBeforeInsert(TriggerState.RecordIterator iterator) {
        for (TriggerState.Record record : iterator.toList()) {
            Account account = new PersonalAccountHandler().execute(record);
            PersonalAccountContainer container = new PersonalAccountContainer(
                account,
                (Contact) record.getRecord()
            );
            this.personalAccounts.add(container);
            super.addRelatedRecord(container.account);
        }

        super.saveRecords();

        for (PersonalAccountContainer personalAccount : this.personalAccounts) {
            personalAccount.updateContactAccount();
        }
    }

    public override void manageAfterInsert(TriggerState.RecordIterator iterator) {
        for (TriggerState.Record record : iterator.toList()) {
            if (record.isRecordType(Contact.getSObjectType(), 'Student')) {
                super.addRelatedRecord(new ProgramEnrollmentCaseHandler().execute(record));
            }
        }

        super.saveRecords();
    }

    private class PersonalAccountContainer {
        public Account account { get; private set; }
        public Contact contact { get; private set; }

        public PersonalAccountContainer(Account account, Contact contact) {
            this.account = account;
            this.contact = contact;
        }

        public void updateContactAccount() {
            this.contact.AccountId = this.account.Id;
        }
    }
}
