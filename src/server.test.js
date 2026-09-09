jest.mock('./app', () => ({
  createApp: jest.fn(),
}));

describe('server.js', () => {
  let listenMock;
  let consoleSpy;
  let originalPort;

  beforeEach(() => {
    jest.resetModules();
    originalPort = process.env.PORT;
    listenMock = jest.fn((port, cb) => {
      if (typeof cb === 'function') cb();
      return { port };
    });
    const { createApp } = require('./app');
    createApp.mockReturnValue({ listen: listenMock });
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  test('calls createApp to build the app', () => {
    const { createApp } = require('./app');
    require('./server');
    expect(createApp).toHaveBeenCalledTimes(1);
  });

  test('calls listen exactly once', () => {
    require('./server');
    expect(listenMock).toHaveBeenCalledTimes(1);
  });

  test('uses default port 3000 when PORT env is not set', () => {
    delete process.env.PORT;
    require('./server');
    expect(listenMock).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  test('uses PORT env when set', () => {
    process.env.PORT = '8080';
    require('./server');
    expect(listenMock).toHaveBeenCalledWith('8080', expect.any(Function));
  });

  test('logs the running message via the listen callback', () => {
    delete process.env.PORT;
    require('./server');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      'devops-pipeline-demo rodando em http://localhost:3000'
    );
  });

  test('logs message including the configured PORT', () => {
    process.env.PORT = '5555';
    require('./server');
    expect(consoleSpy).toHaveBeenCalledWith(
      'devops-pipeline-demo rodando em http://localhost:5555'
    );
  });

  test('passes a function callback to listen', () => {
    require('./server');
    const cb = listenMock.mock.calls[0][1];
    expect(typeof cb).toBe('function');
  });

  test('does not log until the listen callback is invoked', () => {
    listenMock = jest.fn(() => ({}));
    const { createApp } = require('./app');
    createApp.mockReturnValue({ listen: listenMock });
    require('./server');
    expect(listenMock).toHaveBeenCalledTimes(1);
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
