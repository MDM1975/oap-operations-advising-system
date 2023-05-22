trigger CourseCatalogTrigger on Course_Catalog__c(after insert) {
    if (
        [SELECT DisableTriggers__c FROM OrgSettings__mdt WHERE DeveloperName = 'Trigger_Settings']
        ?.DisableTriggers__c != true
    ) {
        TriggerState context = new TriggerState(Trigger.operationType, Trigger.new, Trigger.old);
        new CourseCatalogTriggerManager(context).manage();
    }
}
