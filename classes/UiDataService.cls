public class UiDataService {
    @AuraEnabled
    public static Map<String, Object> createRecord(String sObjectName, String sObjectJson) {
        JsonSObjectConverter converter = new JsonSObjectConverter(sObjectName, sObjectJson);
        Database.SaveResult newSObject = Database.insert(converter.toSObject());
        return new Map<String, Object>{ 'id' => newSObject.getId(), 'record' => converter.toSObject() };
    }

    @AuraEnabled
    public static List<SObject> createRecords(String sObjectName, String sObjectsJson) {
        JsonSObjectConverter converter = new JsonSObjectConverter(sObjectName, sObjectsJson);
        Database.insert(converter.toSObjectList());
        return converter.toSObjectList();
    }

    @AuraEnabled
    public static SObject updateRecord(Id sObjectId, String sObjectJson) {
        JsonSObjectConverter converter = new JsonSObjectConverter(
            sObjectId.getSobjectType().getDescribe().getName(),
            sObjectJson
        );
        Database.update(converter.toSObject());
        return converter.toSObject();
    }

    @AuraEnabled
    public static Boolean deleteRecord(Id sObjectId) {
        SObject record = Database.query(
            'SELECT Id FROM ' + sObjectId.getSObjectType().getDescribe().getName() + ' WHERE Id = :sObjectId'
        )[0];

        record.put('OwnerId', UserInfo.getUserId());
        Database.update(record);

        return Database.delete(record).isSuccess();
    }

    @AuraEnabled
    public static List<SObject> query(String query) {
        return Database.query((String) new JsonAdapter.SoqlAdapter().adapt(query).get('query'));
    }
}