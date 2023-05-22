public interface ISObjectBuilder {
    ISObjectBuilder setField(String fieldName, Object fieldValue);
    ISObjectBuilder setAllFields(Map<String, Object> fields);
}