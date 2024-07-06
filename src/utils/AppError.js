class AppError {
  message;
  statusCode;

  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = AppError;