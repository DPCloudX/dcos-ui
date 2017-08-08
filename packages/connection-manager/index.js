import {
  default as ConnectionManagerClass
} from "./src/js/ConnectionManager/ConnectionManager";

export const ConnectionManager = new ConnectionManagerClass();

export { default as XHRConnection } from "./src/js/Connection/XHRConnection";
export {
  default as WebSocketConnection
} from "./src/js/Connection/WebSocketConnection";
