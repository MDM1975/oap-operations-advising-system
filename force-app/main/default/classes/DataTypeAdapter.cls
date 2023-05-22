public class DataTypeAdapter {
    public interface ITypeAdapter {
        Object adapt(Object value);
    }

    public class IntegerAdapter implements ITypeAdapter {
        public Integer adapt(Object value) {
            return Integer.valueOf(value);
        }
    }

    public class DoubleAdapter implements ITypeAdapter {
        public Double adapt(Object value) {
            return Double.valueOf(value);
        }
    }

    public class BooleanAdapter implements ITypeAdapter {
        public Boolean adapt(Object value) {
            return Boolean.valueOf(value);
        }
    }

    public class DateAdapter implements ITypeAdapter {
        public Date adapt(Object value) {
            List<String> parts = String.valueOf(value).split('-');
            return Date.newInstance(
                Integer.valueOf(parts[0]),
                Integer.valueOf(parts[1]),
                Integer.valueOf(parts[2])
            );
        }
    }
}