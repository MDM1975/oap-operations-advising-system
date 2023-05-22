trigger ProgramEnrollmentTrigger on Program_Enrollment__c(before insert, after insert, before update, after update) {
    if (
        [SELECT DisableTriggers__c FROM OrgSettings__mdt WHERE DeveloperName = 'Trigger_Settings']
        ?.DisableTriggers__c != true
    ) {
        TriggerState context = new TriggerState(Trigger.operationType, Trigger.new, Trigger.old);
        new ProgramEnrollmentTriggerManager(context).manage();
    }
}
