public abstract class TriggerManager {
    private final TriggerState context;
    private final List<SObject> records;
    private final List<Messaging.SingleEmailMessage> emails;

    public TriggerManager(TriggerState context) {
        this.context = context;
        this.records = new List<SObject>();
        this.emails = new List<Messaging.SingleEmailMessage>();
    }

    public void manage() {
        if (this.context.isBeforeInsert()) {
            this.manageBeforeInsert(new TriggerState.RecordIterator(this.context));
        }

        if (this.context.isAfterInsert()) {
            this.manageAfterInsert(new TriggerState.RecordIterator(this.context));
        }

        if (this.context.isBeforeUpdate()) {
            this.manageBeforeUpdate(new TriggerState.RecordIterator(this.context));
        }

        if (this.context.isAfterUpdate()) {
            this.manageAfterUpdate(new TriggerState.RecordIterator(this.context));
        }
    }

    public virtual void manageBeforeInsert(TriggerState.RecordIterator iterator) {
    }

    public virtual void manageAfterInsert(TriggerState.RecordIterator iterator) {
    }

    public virtual void manageBeforeUpdate(TriggerState.RecordIterator iterator) {
    }

    public virtual void manageAfterUpdate(TriggerState.RecordIterator iterator) {
    }

    public void addRelatedRecord(SObject record) {
        this.records.add(record);
    }

    public void saveRecords() {
        Database.upsert(this.records);
    }
}