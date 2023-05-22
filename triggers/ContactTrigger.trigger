trigger ContactTrigger on Contact(before insert, before update, after insert, after update) {
    if (
        [SELECT DisableTriggers__c FROM OrgSettings__mdt WHERE DeveloperName = 'Trigger_Settings']
        ?.DisableTriggers__c != true
    ) {
        TriggerState context = new TriggerState(Trigger.operationType, Trigger.new, Trigger.old);
        new ContactTriggerManager(context).manage();
    }
}
