public class ProgramEnrollmentTriggerManager extends TriggerManager {
    public ProgramEnrollmentTriggerManager(TriggerState context) {
        super(context);
    }

    public override void manageBeforeInsert(TriggerState.RecordIterator iterator) {
        for (TriggerState.Record record : iterator.toList()) {
            if (
                record.isNull(Program_Enrollment__c.Enrollment_Status__c) &&
                record.isNull(Program_Enrollment__c.Academic_Standing__c)
            ) {
                Map<String, SObject> programEnrollment = new ProgramEnrollmentSetupHandler().execute(record);
                super.addRelatedRecord(programEnrollment.get('case'));
            }
        }

        super.saveRecords();
    }

    public override void manageAfterUpdate(TriggerState.RecordIterator iterator) {
        for (TriggerState.Record record : iterator.toList()) {
            if (record.isChanged(Program_Enrollment__c.Enrollment_Status__c)) {
                super.addRelatedRecord(new EnrollmentStatusHandler().execute(record));
            }

            if (record.isChanged(Program_Enrollment__c.Academic_Standing__c)) {
                super.addRelatedRecord(new AcademicStandingHandler().execute(record));
            }
        }

        super.saveRecords();
    }
}