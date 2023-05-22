public class JsonAdapter {
    private interface IJsonAdapter {
        Object adapt(String json);
    }

    public class SObjectAdapter implements IJsonAdapter {
        public Map<String, Object> adapt(String json) {
            return (Map<String, Object>) System.JSON.deserializeUntyped(json);
        }
    }

    public class SObjectListAdapter implements IJsonAdapter {
        public List<Map<String, Object>> adapt(String json) {
            List<Object> sObjectData = (List<Object>) System.JSON.deserializeUntyped(json);
            List<Map<String, Object>> sObjectMaps = new List<Map<String, Object>>();

            for (Object sObjectMap : sObjectData) {
                sObjectMaps.add((Map<String, Object>) sObjectMap);
            }

            return sObjectMaps;
        }
    }

    public class SoqlAdapter implements IJsonAdapter {
        public Map<String, Object> adapt(String json) {
            return (Map<String, Object>) System.JSON.deserializeUntyped(json);
        }
    }
}