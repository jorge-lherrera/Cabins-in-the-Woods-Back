function normalizeBookingDates(req, res, next) {
  try {
    if (req.body.startDate && typeof req.body.startDate === "string") {
      const startDate = new Date(req.body.startDate);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          error: "Data de início inválida",
          details: ["Formato de data não reconhecido"],
        });
      }
      req.body.startDate = startDate;
    }

    if (req.body.endDate && typeof req.body.endDate === "string") {
      const endDate = new Date(req.body.endDate);
      if (isNaN(endDate.getTime())) {
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
