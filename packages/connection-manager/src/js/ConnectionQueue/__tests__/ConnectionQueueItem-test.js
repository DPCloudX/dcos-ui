// import { XHRConnection } from "../../Connection/XHRConnection";
// import { ConnectionQueueItem } from "../ConnectionQueueItem";

// jest.mock("../../Connection/XHRConnection");

const XHRConnection = require("../../Connection/XHRConnection").default;
const ConnectionQueueItem = require("../ConnectionQueueItem").default;

describe("ConnectionQueueItem", () => {
  describe("#init", () => {
    it("inits with given connection & prio", () => {
      expect(() => {
        new ConnectionQueueItem(new XHRConnection("foo.json"));
      }).not.toThrow();
    });
  });
});
