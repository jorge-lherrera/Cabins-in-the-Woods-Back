function calculateNumNights(startDate, endDate) {
  const start = Date.parse(startDate);
  const end = Date.parse(endDate);
  const diffMs = end - start;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default calculateNumNights;
