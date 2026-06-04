class ApiResponse {
  static success(res, data, message = 'Success', status = 200) {
    return res.status(status).json({ success: true, message, data });
  }

  static error(res, message = 'Server error', status = 500, errors = null) {
    return res.status(status).json({ success: false, message, errors });
  }
}

module.exports = ApiResponse;
