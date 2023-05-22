public class SObjectBuilder implements ISObjectBuilder {
    private SObjectType sobjectType;
    private SObject newSObject;

    public SObjectBuilder(SObjectType sobjectType) {
        this.sobjectType = sobjectType;
        this.reset();
    }

    public void reset() {
        this.newSObject = this.sobjectType.newSObject();
    }

    public ISObjectBuilder setField(String fieldName, Object fieldValue) {
        this.newSObject.put(fieldName, fieldValue);
        return this;
    }

    public ISObjectBuilder setAllFields(Map<String, Object> fields) {
        for (String field : fields.keySet()) {
            this.newSObject.put(field, fields.get(field));
        }
        return this;
    }

    public SObject getSObject() {
        return this.newSObject;
    }
}