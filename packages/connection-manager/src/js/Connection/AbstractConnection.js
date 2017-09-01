import { EventEmitter } from "events";
import { CONNECTION_STATE_INIT } from "./ConnectionConstants";

/**
 * AbstractConnection provides some default properties/methods used by Connection Manager
 *
 * Events which MUST be fired by all SubClasses:
 * CONNECTION_EVENT_OPEN: when the connection actually blocks a pipe
 * CONNECTION_EVENT_CLOSE: when the connection frees its pipe
 * CONNECTION_EVENT_ERROR: when an error occurs
 */
export default class AbstractConnection extends EventEmitter {
  constructor(url) {
    super();

    if (this.constructor === AbstractConnection) {
      throw new Error("Can't instantiate abstract class!");
    }

    if (!url) {
      throw new Error("Can't instantiate without given URL!");
    }
    Object.defineProperty(this, "url", {
      get: () => url
    });

    const created = Date.now();
    Object.defineProperty(this, "created", {
      get: () => created
    });

    let state = CONNECTION_STATE_INIT;
    Object.defineProperty(this, "state", {
      get: () => state,
      set: s => {
        state = s;
      }
    });

    const symbol = Symbol("Connection:" + this.url + this.created);
    Object.defineProperty(this, "symbol", {
      get: () => symbol
    });
  }

  // Abstract Methods
  /* eslint-disable no-unused-vars */
  /**
   * Opens the connection
   * @param {string} token – Authentication token
   */
  open(token) {}
  /**
   * Closes the connection
   */
  close() {}
  /**
   * Resets the connection
   */
  reset() {}
}
