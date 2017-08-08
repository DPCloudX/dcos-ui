import { AbstractConnection } from "../Connection/AbstractConnection";

/**
 * Internal Item for ConnectionStore, stores priority & connection
 */
export default class ConnectionQueueItem {
  /**
   * Inits new Item with given Connection & Priority
   * @param {AbstractConnection} connection – given connection
   * @param {int} [priority=0] – given priority
   */
  constructor(connection, priority = 0) {
    Object.defineProperty(this, "connection", {
      get: () => connection
    });

    Object.defineProperty(this, "priority", {
      get: () => priority
    });

    if (!(connection instanceof AbstractConnection)) {
      throw new Error(
        "Invalid Connection, has to be an instance of AbstractConnection."
      );
    }

    if (typeof priority !== "number" || priority < 0) {
      throw new Error("Invalid Priority, has to be a number greater then 0.");
    }
  }
  /**
   * Checks if Connection in Item is the same, does NOT check priority!
   * see: https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#equals-java.lang.Object-
   * @param {ConnectionListItem} item – given item to compare
   * @return {boolean} – true: same, false: differs
   */
  equals(item) {
    return this.connection === item.connection;
  }
}
