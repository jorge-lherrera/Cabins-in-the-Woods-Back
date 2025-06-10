function updatedFields(data, fields) {
  const result = {};
  for (const field of fields) {
    if (data[field] !== undefined && data[field] !== "") {
      result[field] = data[field];
    }
  }
  return result;
}

module.exports = updatedFields;
