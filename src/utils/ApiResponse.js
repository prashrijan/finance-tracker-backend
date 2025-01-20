class ApiResponse {
  constructor(message = "Success", statusCode, data) {
    (this.message = message),
      (this.data = data),
      (this.success = statusCode < 400);
    this.statusCode = statusCode;
  }
}

export default ApiResponse;
