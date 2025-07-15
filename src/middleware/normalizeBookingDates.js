function normalizeBookingDates(req, res, next) {
  try {
    const offsetHours = -3;

    function toUtcDate(dateStr, offset = offsetHours) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;

      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        date.setHours(0, 0, 0, 0);
      }

      return new Date(date.getTime() - offset * 60 * 60 * 1000);
    }

    if (req.body.startDate && typeof req.body.startDate === "string") {
      const startDate = toUtcDate(req.body.startDate);
      if (!startDate) {
        return res.status(400).json({
          error: "Data de início inválida",
          details: ["Formato de data não reconhecido"],
        });
      }
      req.body.startDate = startDate;
    }

    if (req.body.endDate && typeof req.body.endDate === "string") {
      const endDate = toUtcDate(req.body.endDate);
      if (!endDate) {
        return res.status(400).json({
          error: "Data de término inválida",
          details: ["Formato de data não reconhecido"],
        });
      }
      req.body.endDate = endDate;
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: "Erro ao processar datas",
      details: [error.message],
    });
  }
}

module.exports = normalizeBookingDates;
