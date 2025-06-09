function successResponse(res, status, message, resource = null) {
  return res.status(status).json({
    resource,
    error: null,
    status,
    message,
  });
}

module.exports = successResponse;
