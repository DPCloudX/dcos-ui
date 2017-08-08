import { AuthStore } from "authenticator";
import ConnectionList from "../ConnectionStore/ConnectionStore.js";
import {
  CONNECTION_STATE_INIT,
  CONNECTION_STATE_STARTED,
  CONNECTION_STATE_DONE,
  CONNECTION_STATE_CANCELED
} from "../Connections/ConnectionConstants";

/**
 * The Connection Manager which is responsible for
 * queuing Connections into the ConnectionStore and
 * actually starting them, when they are head of
 * waiting line.
 */
export default class ConnectionManager {
  /**
   * Initializes an Instance of ConnectionManager
   * @param {Integer} maxConnections – max open connections
   */
  constructor(maxConnections = 6) {
    Object.defineProperty(this, "maxConnections", {
      get() {
        return maxConnections;
      }
    });

    let waiting = new ConnectionList();
    Object.defineProperty(this, "waiting", {
      get() {
        return waiting;
      },
      set(w) {
        waiting = w;
      }
    });

    let open = new ConnectionList();
    Object.defineProperty(this, "open", {
      get() {
        return open;
      },
      set(o) {
        open = o;
      }
    });

    this.handleConnectionClose = this.handleConnectionClose.bind(this);
  }

  /**
   * Queues given connection with given priority
   * @param {AbstractConnection} connection – connection to queue
   * @param {Integer} [priority=0] – optional change of priority, will be updated inside connection
   */
  queue(connection, priority = 0) {
    if (
      connection.state !== CONNECTION_STATE_DONE &&
      connection.listeners("close").includes(this.handleClose)
    ) {
      connection.on("close", this.handleConnectionClose);
    }

    switch (connection.state) {
      case CONNECTION_STATE_INIT:
        this.waiting = this.waiting.add(connection, priority);
        break;
      case CONNECTION_STATE_STARTED:
        this.open = this.open.add(connection, priority);
        break;
    }

    this.startNext();
  }
  /**
   * handles all queue activity events
   * @param {AbstractConnection} connection
   * @return {void}
   */
  startNext() {
    if (this.open.length >= this.maxConnections || this.waiting.length) {
      return;
    }

    const connection = this.waiting.head();
    this.waiting = this.waiting.tail();
    switch (connection.state) {
      case CONNECTION_STATE_INIT:
        this.open = this.open.add(connection);
        connection.open(AuthStore.getTokenForURL(connection.url));
        break;
      case CONNECTION_STATE_STARTED:
        this.open = this.open.add(connection);
        break;
      case CONNECTION_STATE_DONE:
      case CONNECTION_STATE_CANCELED:
        // nothing
        break;
    }

    this.startNext();
  }
  /**
   * handles connection events, removes connection from store
   * @param {AbstractConnection} connection – connection which fired the event
   * @return {void}
   */
  handleConnectionClose(connection) {
    this.open = this.open.delete(connection);
    this.startNext();
  }
}
