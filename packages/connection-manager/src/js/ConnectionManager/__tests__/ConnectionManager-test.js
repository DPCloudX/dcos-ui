// const ConnectionQueue = require("../../ConnectionQueue/ConnectionQueue").default;
const ConnectionManagerClass = require("../ConnectionManager").default;

jest.mock("../../ConnectionStore/ConnectionStore");

var ConnectionManager;
var ConnectionTemplate = opts =>
  Object.assign(
    {
      state: 0,
      priority: 0,
      listeners: jest.fn(() => []),
      on: jest.fn(),
      open: jest.fn()
    },
    opts
  );

describe("ConnectionManager", () => {
  beforeEach(() => {
    ConnectionManager = new ConnectionManagerClass();
  });
  it("add listeners to new connection", () => {
    var connection = new ConnectionTemplate();

    ConnectionManager.queue(connection);
    expect(connection.on).toBeCalled();
  });
  it("dont add listeners second time", () => {
    var connection = new ConnectionTemplate();

    connection.listeners.mockImplementationOnce(() => [
      ConnectionManager.handleConnectionClosingEvents
    ]);
    ConnectionManager.queue(connection);
    expect(connection.on).not.toBeCalled();
  });
  it("open next waiting connection from store", () => {
    var connection = new ConnectionTemplate();
    ConnectionManager.store.waitingCount.mockReturnValueOnce(1);
    ConnectionManager.store.waitingHead.mockReturnValueOnce(connection);

    ConnectionManager.handleQueueActivity();
    expect(connection.open).toBeCalled();
  });

  it("delete closed connection from store", () => {
    var connection = new ConnectionTemplate();

    ConnectionManager.handleConnectionClosingEvents(connection);
    expect(ConnectionManager.store.delete).toBeCalled();
  });
});
