function successResponse(res, status, message, data = null, key = null) {
  const response = { success: true, message };
  if (data && key) response[key] = data;
  return res.status(status).json(response);
}

module.exports = successResponse;
