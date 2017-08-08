const ConnectionList = jest.genMockFromModule(
  "../../ConnectionList/ConnectionList"
);

// defining some default cases for this mock
ConnectionList.default.prototype.add = jest.fn();
ConnectionList.default.prototype.head = jest.fn();
ConnectionList.default.prototype.tail = jest.fn();
ConnectionList.default.prototype.remove = jest.fn();

module.exports = ConnectionList;
