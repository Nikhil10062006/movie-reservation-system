class ApiError extends Error {
  constructor(message, errors = [], stack = "", statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
export { ApiError };
