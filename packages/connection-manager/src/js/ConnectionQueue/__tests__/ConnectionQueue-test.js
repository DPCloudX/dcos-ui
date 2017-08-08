const Immutable = require("immutable");
const ConnectionQueue = require("../ConnectionQueue").default;
// const ConnectionQueueItem = require("../ConnectionQueueItem").default;
// const XHRConnection = require("../../Connection/XHRConnection").default;

console.log(Immutable);

jest.mock("../ConnectionQueueItem");
jest.mock("../../Connection/XHRConnection");

Object.assign(global[Symbol.for("$$jest-matchers-object")].matchers, {
  toBeMagic(received, predicate) {
    console.log(received.mock);

    return {
      message: "Predicate function not have been called",
      pass: received.mock.calls.some(predicate)
    };
  }
});

describe("ConnectionQueue", () => {
  describe("#init", () => {
    it("inits successfully", () => {
      expect(() => new ConnectionQueue()).not.toThrow();
    });
  });
  describe("#add", () => {
    it("adds connection", () => {
      const list = new List();
      const connection = XHRConnection();
      new ConnectionQueue(list).enqueue(connection);
      expect(list.add).toBeMagic(function(item) {
        console.log("item", item);

        return item.connection === connection;
      });
    });
  });
});

/*
var ConnectionStore;
var ConnectionTemplate = opts =>
  Object.assign(
    {
      state: 0,
      listeners: jest.fn(() => []),
      on: jest.fn(),
      open: jest.fn()
    },
    opts
  );
var StoreItemTemplate = (
  priority = 0,
  connection = new ConnectionTemplate()
) => ({
  priority,
  connection
});

describe("ConnectionStore", () => {
  beforeEach(() => {
    ConnectionStore = new ConnectionStoreClass();
  });
  describe("waitingCount", () => {
    it("no waiting after init", () => {
      expect(ConnectionStore.waitingCount()).toEqual(0);
    });

    it("has waiting after added waiting", () => {
      ConnectionStore.store.push(new StoreItemTemplate());
      expect(ConnectionStore.waitingCount()).toEqual(1);
    });

    it("no waiting after added open", () => {
      ConnectionStore.store.push(
        new StoreItemTemplate(0, new ConnectionTemplate({ state: 1 }))
      );
      expect(ConnectionStore.waitingCount()).toEqual(0);
    });
  });
  describe("openCount", () => {
    it("no open after init", () => {
      expect(ConnectionStore.openCount()).toEqual(0);
    });

    it("has open after added open", () => {
      ConnectionStore.store.push(
        new StoreItemTemplate(0, new ConnectionTemplate({ state: 1 }))
      );
      expect(ConnectionStore.openCount()).toEqual(1);
    });

    it("no open after added waiting", () => {
      ConnectionStore.store.push(new StoreItemTemplate());
      expect(ConnectionStore.openCount()).toEqual(0);
    });
  });

  describe("add", () => {
    it("adds connection", () => {
      const connection = new ConnectionTemplate();
      ConnectionStore.add(connection);
      expect(ConnectionStore.length).toEqual(1);
    });
    it("adds connections in correct order (0,1)", () => {
      const connection0 = new ConnectionTemplate(),
        connection1 = new ConnectionTemplate();
      ConnectionStore.add(connection0, 0);
      ConnectionStore.add(connection1, 1);
      expect(ConnectionStore.indexOf(connection0)).toEqual(1);
      expect(ConnectionStore.indexOf(connection1)).toEqual(0);
    });
    it("adds connections in correct order (1,0)", () => {
      const connection0 = new ConnectionTemplate(),
        connection1 = new ConnectionTemplate();
      ConnectionStore.add(connection1, 1);
      ConnectionStore.add(connection0, 0);
      expect(ConnectionStore.indexOf(connection0)).toEqual(1);
      expect(ConnectionStore.indexOf(connection1)).toEqual(0);
    });
    it("adds connections in correct order (0,0)", () => {
      const connection0 = new ConnectionTemplate(),
        connection1 = new ConnectionTemplate();
      ConnectionStore.add(connection0, 0);
      ConnectionStore.add(connection1, 0);
      expect(ConnectionStore.indexOf(connection0)).toEqual(0);
      expect(ConnectionStore.indexOf(connection1)).toEqual(1);
    });
  });

  describe("waitingHead", () => {
    it("always returns item with highest priority", () => {
      const connection = new ConnectionTemplate();
      ConnectionStore.add(new ConnectionTemplate(), 2);
      ConnectionStore.add(new ConnectionTemplate(), 3);
      ConnectionStore.add(connection, 5);
      ConnectionStore.add(new ConnectionTemplate(), 2);
      expect(ConnectionStore.waitingHead()).toBe(connection);
    });
  });

  describe("includes", () => {
    it("finds stored connection", () => {
      const connection = new ConnectionTemplate();
      ConnectionStore.store.push(new StoreItemTemplate(0, connection));
      expect(ConnectionStore.includes(connection)).toEqual(true);
    });

    it("finds stored connection with offset", () => {
      const connection = new ConnectionTemplate();
      ConnectionStore.store.splice(
        0,
        0,
        new StoreItemTemplate(),
        new StoreItemTemplate(),
        new StoreItemTemplate(0, connection)
      );
      expect(ConnectionStore.includes(connection, 2)).toEqual(true);
    });

    it("does not find not stored connection", () => {
      const connection = new ConnectionTemplate();
      expect(ConnectionStore.includes(connection)).toEqual(false);
    });
  });
  describe("delete", () => {
    it("deletes connection", () => {
      const connection = new ConnectionTemplate();

      ConnectionStore.store.push(new StoreItemTemplate(0, connection));
      expect(ConnectionStore.delete(connection)).toEqual(true);
    });
    it("cant delete unknown connection", () => {
      const connection = new StoreItemTemplate();
      expect(() => ConnectionStore.delete(connection)).toThrow();
    });
  });
});
*/
