import AbstractConnection from "./AbstractConnection";
import {
  CONNECTION_EVENT_CLOSE,
  CONNECTION_EVENT_OPEN,
  CONNECTION_EVENT_PROGRESS,
  CONNECTION_EVENT_ABORT,
  CONNECTION_EVENT_ERROR,
  CONNECTION_EVENT_SUCCESS,
  CONNECTION_STATE_CANCELED,
  CONNECTION_STATE_INIT,
  CONNECTION_STATE_DONE,
  CONNECTION_STATE_STARTED
} from "./ConnectionConstants";

/**
 * Basic XHR Connection
 * @todo add/remove headers
 */
export default class XHRConnection extends AbstractConnection {
  /**
   * Initialises an Instance of XHRConnection
   * @constructor
   * @param {string} url – URL to be fetched
   * @param {string} [_method=GET] – used method
   * @param {mixed} [_data] – payload for request
   * @param {string} [_header] – additional headers (like content-type)
   */
  constructor(url, _method = "GET", _data = null, _header = null) {
    super(url);

    var method = _method;
    Object.defineProperty(this, "method", {
      get: () => method,
      set: s => {
        method = s;
      }
    });
    var data = _data;
    Object.defineProperty(this, "data", {
      get: () => data,
      set: s => {
        data = s;
      }
    });
    var header = Object.assign({}, _header);
    Object.defineProperty(this, "header", {
      get: () => header,
      set: h => {
        header = Object.assign(header, h);
      }
    });

    var xhr = null;
    Object.defineProperty(this, "xhr", {
      get: () => xhr,
      set: x => {
        if (
          this.state !== CONNECTION_STATE_INIT ||
          this.state !== CONNECTION_STATE_CANCELED
        ) {
          xhr.abort();
          this.emit(CONNECTION_EVENT_ERROR);
        }
        xhr = x;
        this.state = CONNECTION_STATE_INIT;
      }
    });

    this.handleOpen = this.handleOpen.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleAbort = this.handleAbort.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  /**
   * more xhr related getter
   * @todo make them more robust
   */
  get response() {
    return this.xhr.response;
  }
  get readyState() {
    return this.xhr.readyState;
  }
  get responseType() {
    return this.xhr.responseType;
  }
  get status() {
    return this.xhr.status;
  }

  /**
   * create, prepare, open and send the xhr request
   * @param {string} [token] – authentication token
   */
  open(token) {
    if (this.xhr !== null) {
      throw new Error("cannot open XHR Connection a second time!");
    }
    this.xhr = new XMLHttpRequest();

    // this.xhr.on("open", this.handleOpen);
    this.xhr.on("progress", this.handleProgress);
    this.xhr.on("abort", this.handleAbort);
    this.xhr.on("error", this.handleError);
    this.xhr.on("load", this.handleLoad);
    this.xhr.on("timeout", this.handleTimeout);
    this.xhr.open(this.protected.method, this.protected.url);

    this.handleOpen();

    // this.xhr.withCredentials = true;

    if (this.header !== null) {
      // this.xhr.setRequestHeader("Content-Type", this.protected.contentType);
    }

    if (token !== undefined && token !== "") {
      this.xhr.setRequestHeader("Authorization", "Bearer " + token);
    }

    this.xhr.send(this.data);
  }
  /**
   * aborts native xhr
   */
  close() {
    this.xhr.abort();
  }
  /**
   *
   * @todo abort here before delete?
   */
  reset() {
    this.state = CONNECTION_STATE_CANCELED;
    this.xhr = null;
  }

  /**
   * handle open  of native xhr
   */
  handleOpen() {
    this.state = CONNECTION_STATE_STARTED;
    this.emit(CONNECTION_EVENT_OPEN, this);
  }
  /**
   * handle open  of native xhr
   */
  handleProgress() {
    this.emit(CONNECTION_EVENT_PROGRESS, this);
  }
  /**
   * handle abort  of native xhr
   */
  handleAbort() {
    this.state = CONNECTION_STATE_DONE;
    this.emit(CONNECTION_EVENT_ABORT, this);
    this.emit(CONNECTION_EVENT_CLOSE, this);
  }
  /**
   * handle error  of native xhr
   */
  handleError() {
    this.state = CONNECTION_STATE_DONE;
    this.emit(CONNECTION_EVENT_ERROR, this);
    this.emit(CONNECTION_EVENT_CLOSE, this);
  }
  /**
   * handle load  of native xhr
   */
  handleLoad() {
    this.state = CONNECTION_STATE_DONE;
    if (this.status >= 400) {
      this.emit(CONNECTION_EVENT_ERROR, this);
    } else {
      this.emit(CONNECTION_EVENT_SUCCESS, this);
    }
    this.emit(CONNECTION_EVENT_CLOSE, this);
  }
  /**
   * handle timeout  of native xhr
   */
  handleTimeout() {
    this.handleError();
  }
}
