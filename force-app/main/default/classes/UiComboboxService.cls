public class UiComboboxService {
    @AuraEnabled(cacheable=true)
    public static String getMetadataCombobox(String sObjectName, String fieldName) {
        List<Map<String, String>> comboboxOptions = new List<Map<String, String>>();
        comboboxOptions.add(new Map<String, String>{ 'label' => '--None--', 'value' => '' });
        List<PicklistEntry> picklistMetadata = MetadataRepository.getPicklistMetadata(sObjectName, fieldName);
        for (PicklistEntry picklistEntry : picklistMetadata) {
            Map<String, String> comboboxOption = new Map<String, String>();
            comboboxOption.put('label', picklistEntry.getLabel());
            comboboxOption.put('value', picklistEntry.getValue());
            comboboxOptions.add(comboboxOption);
        }
        return JSON.serialize(comboboxOptions);
    }

    @AuraEnabled(cacheable=true)
    public static String getRecordCombobox(List<SObject> records, String labelField, String valueField) {
        List<Map<String, String>> comboboxOptions = new List<Map<String, String>>();
        comboboxOptions.add(new Map<String, String>{ 'label' => '--None--', 'value' => '' });
        for (SObject record : records) {
            Map<String, String> comboboxOption = new Map<String, String>();
            comboboxOption.put('label', (String) record.get(labelField));
            comboboxOption.put('value', (String) record.get(valueField));
            comboboxOptions.add(comboboxOption);
        }
        return JSON.serialize(comboboxOptions);
    }
}