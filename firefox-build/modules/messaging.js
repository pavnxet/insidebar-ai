const DEFAULT_MESSAGE_TIMEOUT_MS = 2000;

export function sendMessageWithTimeout(message, options = {}) {
  const { timeout = DEFAULT_MESSAGE_TIMEOUT_MS, expectResponse = true } = options;

  if (!expectResponse) {
    // Fire-and-forget: browser.runtime.sendMessage returns a Promise in Firefox
    try {
      browser.runtime.sendMessage(message).catch(() => {
        // Ignore errors for fire-and-forget messages
      });
    } catch (error) {
      // Ignore errors for fire-and-forget messages
    }
    return Promise.resolve(undefined);
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Message timeout${message?.action ? `: ${message.action}` : ''}`));
    }, timeout);

    browser.runtime.sendMessage(message)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export function notifyMessage(message) {
  return sendMessageWithTimeout(message, { expectResponse: false });
}

