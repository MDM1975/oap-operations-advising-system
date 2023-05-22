public interface ITriggerHandler {
    Object execute(TriggerState.Record record);
}