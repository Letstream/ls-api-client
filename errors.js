export function AccessForbiddenError(message) {
  var instance = new Error(message);
  instance.name = 'AccessForbiddenError';

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, AccessForbiddenError);
  }
  return instance;
}

AccessForbiddenError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(AccessForbiddenError, Error);
} else {
  AccessForbiddenError.__proto__ = Error;
}

export function UnauthorizedError(message) {
  var instance = new Error(message);
  instance.name = 'UnauthorizedError';

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, UnauthorizedError);
  }
  return instance;
}

UnauthorizedError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(UnauthorizedError, Error);
} else {
  UnauthorizedError.__proto__ = Error;
}

export function UnknownError(message) {
  var instance = new Error(message);
  instance.name = 'UnknownError';

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, UnknownError);
  }
  return instance;
}

UnknownError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(UnknownError, Error);
} else {
  UnknownError.__proto__ = Error;
}

export function NetworkError(message) {
  var instance = new Error(message);
  instance.name = 'NetworkError';

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, NetworkError);
  }
  return instance;
}

NetworkError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(NetworkError, Error);
} else {
  NetworkError.__proto__ = Error;
}

export function ServerError(message) {
  var instance = new Error(message);
  instance.name = 'ServerError';

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, ServerError);
  }
  return instance;
}

ServerError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(ServerError, Error);
} else {
  ServerError.__proto__ = Error;
}

export function NotFoundError(message) {
  var instance = new Error(message);
  instance.name = 'NotFoundError';

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, NotFoundError);
  }
  return instance;
}

NotFoundError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(NotFoundError, Error);
} else {
  NotFoundError.__proto__ = Error;
}