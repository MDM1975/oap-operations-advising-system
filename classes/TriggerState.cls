public class TriggerState {
    private final TriggerOperation operationType;
    private final List<SObject> newRecords;
    private final List<SObject> oldRecords;

    public TriggerState(TriggerOperation operationType, List<SObject> newRecords, List<SObject> oldRecords) {
        this.operationType = operationType;
        this.newRecords = newRecords;
        this.oldRecords = oldRecords;
    }

    public boolean isBeforeInsert() {
        return this.operationType == TriggerOperation.BEFORE_INSERT;
    }

    public boolean isAfterInsert() {
        return this.operationType == TriggerOperation.AFTER_INSERT;
    }

    public boolean isBeforeUpdate() {
        return this.operationType == TriggerOperation.BEFORE_UPDATE;
    }

    public boolean isAfterUpdate() {
        return this.operationType == TriggerOperation.AFTER_UPDATE;
    }

    public boolean isBeforeDelete() {
        return this.operationType == TriggerOperation.BEFORE_DELETE;
    }

    public boolean isAfterDelete() {
        return this.operationType == TriggerOperation.AFTER_DELETE;
    }

    public class RecordIterator {
        private Integer index = 0;
        private List<SObject> newRecords;
        private List<SObject> oldRecords;

        public RecordIterator(TriggerState recordContext) {
            this.newRecords = recordContext.newRecords;
            this.oldRecords = recordContext.oldRecords;
        }

        public List<Record> toList() {
            List<Record> records = new List<Record>();
            while (this.hasNext()) {
                records.add(this.next());
            }
            return records;
        }

        public Boolean hasNext() {
            return this.newRecords != null && this.index < this.newRecords.size();
        }

        public Record next() {
            return this.getNext(this.index++);
        }

        private Record getNext(Integer index) {
            SObject newRecord = index < this.newRecords?.size() ? this.newRecords[index] : null;
            SObject oldRecord = index < this.oldRecords?.size() ? this.oldRecords[index] : null;
            return new Record(newRecord, oldRecord);
        }
    }

    public class Record {
        private final SObject currentState;
        private final SObject priorState;

        public Record(SObject currentState, SObject priorState) {
            this.currentState = currentState;
            this.priorState = priorState;
        }

        public SObject getRecord() {
            return this.currentState;
        }

        public SObject getRecordPrior() {
            return this.priorState;
        }

        public Boolean isChanged(SObjectField field) {
            return this.priorState != null ? this.currentState.get(field) != this.priorState.get(field) : false;
        }

        public Boolean isNull(SObjectField field) {
            return this.currentState.get(field) == null;
        }

        public Boolean isNotNull(SObjectField field) {
            return this.currentState.get(field) != null;
        }

        public Boolean isRecordType(SObjectType sObjectType, String recordTypeName) {
            return this.currentState.get('RecordTypeId') ==
                MetadataRepository.getRecordTypeMetadata(sObjectType.getDescribe().getName(), recordTypeName)
                    .getRecordTypeId();
        }
    }
}