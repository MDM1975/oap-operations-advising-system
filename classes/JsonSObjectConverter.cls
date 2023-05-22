public class JsonSObjectConverter {
    private final String sObjectName;
    private final String sObjectJsonData;
    private final Map<SoapType, DataTypeAdapter.ITypeAdapter> dataTypeAdapters;

    public JsonSObjectConverter(String sObjectName, String sObjectJson) {
        this.sObjectName = sObjectName;
        this.sObjectJsonData = sObjectJson;

        this.dataTypeAdapters = new Map<SoapType, DataTypeAdapter.ITypeAdapter>{
            SoapType.Integer => new DataTypeAdapter.IntegerAdapter(),
            SoapType.Double => new DataTypeAdapter.DoubleAdapter(),
            SoapType.Boolean => new DataTypeAdapter.BooleanAdapter(),
            SoapType.Date => new DataTypeAdapter.DateAdapter()
        };
    }

    public SObject toSObject() {
        JsonAdapter.SObjectAdapter sObjectAdapter = new JsonAdapter.SObjectAdapter();
        Map<String, Object> sObjectData = this.adpatJsonData(sObjectAdapter.adapt(this.sObjectJsonData));
        SObjectBuilder builder = new SObjectBuilder(MetadataRepository.getSObjectMetadata(this.sObjectName));
        builder.setAllFields(sObjectData);
        return builder.getSObject();
    }

    public List<SObject> toSObjectList() {
        JsonAdapter.SObjectListAdapter sObjectListAdapter = new JsonAdapter.SObjectListAdapter();
        List<Map<String, Object>> sObjectDataList = sObjectListAdapter.adapt(this.sObjectJsonData);
        List<SObject> sObjectList = new List<SObject>();

        for (Map<String, Object> sObjectData : sObjectDataList) {
            JsonAdapter.SObjectListAdapter sObjectAdapter = new JsonAdapter.SObjectListAdapter();
            SObjectBuilder builder = new SObjectBuilder(MetadataRepository.getSObjectMetadata(this.sObjectName));
            builder.setAllFields(sObjectData);
            sObjectList.add(builder.getSObject());
        }

        return sObjectList;
    }

    private Map<String, Object> adpatJsonData(Map<String, Object> sObjectData) {
        for (String field : sObjectData.keySet()) {
            SoapType soapType = MetadataRepository.getFieldSoapType(this.sObjectName, field);
            if (this.dataTypeAdapters.containsKey(soapType)) {
                sObjectData.put(field, this.dataTypeAdapters.get(soapType).adapt(sObjectData.get(field)));
            } else {
                sObjectData.put(field, sObjectData.get(field));
            }
        }

        return sObjectData;
    }
}