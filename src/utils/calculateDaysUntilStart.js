function calculateNumNights(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffMs = end - start;

  const numNights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return numNights;
}

export default calculateNumNights;
