public class MetadataRepository {
    private static final Map<String, SObjectType> GLOBAL_METADATA = Schema.getGlobalDescribe();

    public static SObjectType getSObjectMetadata(String sObjectName) {
        return GLOBAL_METADATA.get(sObjectName);
    }

    public static SObjectField getFieldMetadata(String sObjectName, String fieldName) {
        return GLOBAL_METADATA.get(sObjectName).getDescribe().fields.getMap().get(fieldName);
    }

    public static List<PicklistEntry> getPicklistMetadata(String sObjectName, String fieldName) {
        return GLOBAL_METADATA.get(sObjectName)
            .getDescribe()
            .fields.getMap()
            .get(fieldName)
            .getDescribe()
            .getPicklistValues();
    }

    public static SoapType getFieldSoapType(String sObjectName, String fieldName) {
        return GLOBAL_METADATA.get(sObjectName)
            .getDescribe()
            .fields.getMap()
            .get(fieldName)
            .getDescribe()
            .getSoapType();
    }

    public static RecordTypeInfo getRecordTypeMetadata(String sObjectName, String recordTypeName) {
        return GLOBAL_METADATA.get(sObjectName).getDescribe().getRecordTypeInfosByName().get(recordTypeName);
    }
}