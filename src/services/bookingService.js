const { Op, Sequelize } = require("sequelize");
const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");
const MESSAGES = require("../utils/messages");
const findById = require("../utils/findById");
const updatedFields = require("../utils/updatedFields");
const checkOverlap = require("../utils/checkOverlap");
const validateBusinessRules = require("../utils/validateBusinessRules");

async function getAllBookings({ where, orderBy, order, limit, offset, page }) {
  const bookings = await Booking.findAndCountAll({
    where,
    include: [
      { model: Cabin, as: "cabin" },
      { model: Guest, as: "guest" },
    ],
    order: [[orderBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
    limit,
    offset,
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const bookingsToday = await Booking.findAll({
    where: {
      ...where,
      startDate: { [Op.between]: [todayStart, todayEnd] },
    },
    include: [
      { model: Cabin, as: "cabin" },
      { model: Guest, as: "guest" },
    ],
    order: [[orderBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
  });

  const totalRevenue = await Booking.sum("totalPrice", { where });

  const checkedInBookings = await Booking.count({
    where: { ...where, status: "checked-in" },
  });

  const totalCabins = await Cabin.count();
  const activeBookings = await Booking.count({
    where: {
      ...where,
      status: ["checked-in", "unconfirmed"],
    },
  });
  const occupancyRate =
    totalCabins > 0 ? (activeBookings / totalCabins) * 100 : 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesData = await Booking.findAll({
    where: {
      ...where,
      startDate: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("startDate")), "date"],
      [Sequelize.fn("SUM", Sequelize.col("totalPrice")), "revenue"],
    ],
    group: [Sequelize.fn("DATE", Sequelize.col("startDate"))],
    order: [[Sequelize.fn("DATE", Sequelize.col("startDate")), "ASC"]],
    raw: true,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingsWithDays = bookings.rows.map((booking) => {
    const startDate = new Date(booking.startDate);
    startDate.setHours(0, 0, 0, 0);

    const timeDiff = startDate.getTime() - today.getTime();
    const daysUntilStart = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return {
      resource: {
        ...booking.toJSON(),
        daysUntilStart: daysUntilStart,
      },
      error: null,
      status: 200,
    };
  });

  const bookingsTodayWithDays = bookingsToday.map((booking) => {
    const startDate = new Date(booking.startDate);
    startDate.setHours(0, 0, 0, 0);

    const timeDiff = startDate.getTime() - today.getTime();
    const daysUntilStart = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return {
      resource: {
        ...booking.toJSON(),
        daysUntilStart,
      },
      error: null,
      status: 200,
    };
  });

  const nightRanges = {
    "2-3": 0,
    "4-5": 0,
    "8-14": 0,
  };

  bookings.rows.forEach((booking) => {
    if (booking.numNights >= 2 && booking.numNights <= 3) nightRanges["2-3"]++;
    else if (booking.numNights >= 4 && booking.numNights <= 5)
      nightRanges["4-5"]++;
    else if (booking.numNights >= 8 && booking.numNights <= 14)
      nightRanges["8-14"]++;
  });

  const bookingStats = {
    total: bookings.count,
    bookings: bookingsWithDays,
    bookingsToday: bookingsTodayWithDays,
    nightRanges,
    totalRevenue: totalRevenue || 0,
    checkedInBookings,
    occupancyRate: Math.round(occupancyRate * 100) / 100,
    salesChart: salesData,
    page,
    limit,
  };

  return { resource: bookingStats, error: null, status: 200 };
}

async function getBookingById(id) {
  const existingBooking = await Booking.findByPk(id, {
    include: [
      { model: Cabin, as: "cabin" },
      { model: Guest, as: "guest" },
    ],
  });
  if (!existingBooking) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Reserva"),
      status: 404,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(existingBooking.startDate);
  startDate.setHours(0, 0, 0, 0);
  const timeDiff = startDate.getTime() - today.getTime();
  const daysUntilStart = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const bookingObj = existingBooking.toJSON();
  bookingObj.daysUntilStart = daysUntilStart;

  return {
    resource: bookingObj,
    error: null,
    status: 200,
  };
}

async function createBooking(data) {
  const {
    cabinId,
    guestId,
    startDate,
    endDate,
    numNights,
    numGuests,
    extrasPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
  } = data;

  const cabin = await Cabin.findByPk(cabinId);
  const guest = await Guest.findByPk(guestId);

  if (!cabin || !guest) {
    return {
      error: !cabin
        ? MESSAGES.GENERAL.NOT_FOUND("Cabana")
        : MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
      status: 409,
    };
  }

  const overlap = await checkOverlap({ cabinId, startDate, endDate });
  if (overlap.error) return overlap;

  const rules = await validateBusinessRules({
    cabinId,
    numNights,
    numGuests,
    hasBreakfast,
    extrasPrice,
  });
  if (rules.error) return rules;

  const booking = await Booking.create({
    cabinId,
    guestId,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice: rules.resource.cabinPrice,
    extrasPrice,
    totalPrice: rules.resource.finalTotalPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
  });

  const bookingObj = booking.toJSON();

  return { resource: bookingObj, error: null, status: 201 };
}

async function updateBooking(id, data) {
  const {
    cabinId,
    guestId,
    startDate,
    endDate,
    numNights,
    numGuests,
    extrasPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
  } = data;

  const existingBooking = await findById(Booking, id);
  if (!existingBooking) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Reserva"),
      status: 404,
    };
  }

  const getFinal = (newValue, currentValue) =>
    newValue !== undefined ? newValue : currentValue;

  const finalCabinId = getFinal(cabinId, existingBooking.cabinId);
  const finalGuestId = getFinal(guestId, existingBooking.guestId);
  const finalStartDate = getFinal(startDate, existingBooking.startDate);
  const finalEndDate = getFinal(endDate, existingBooking.endDate);
  const finalNumNights = getFinal(numNights, existingBooking.numNights);
  const finalNumGuests = getFinal(numGuests, existingBooking.numGuests);
  const finalExtrasPrice = getFinal(extrasPrice, existingBooking.extrasPrice);
  const finalHasBreakfast = getFinal(
    hasBreakfast,
    existingBooking.hasBreakfast
  );

  const rules = await validateBusinessRules({
    cabinId: finalCabinId,
    guestId: finalGuestId,
    numNights: finalNumNights,
    numGuests: finalNumGuests,
    hasBreakfast: finalHasBreakfast,
    extrasPrice: finalExtrasPrice,
  });
  if (rules.error) return rules;

  const datesChanged =
    new Date(existingBooking.startDate).getTime() !==
      new Date(finalStartDate).getTime() ||
    new Date(existingBooking.endDate).getTime() !==
      new Date(finalEndDate).getTime();

  if (datesChanged) {
    const overlap = await checkOverlap({
      cabinId: finalCabinId,
      startDate: finalStartDate,
      endDate: finalEndDate,
      excludeId: id,
    });
    if (overlap.error) return overlap;
  }

  const fields = [
    "cabinId",
    "guestId",
    "startDate",
    "endDate",
    "numNights",
    "numGuests",
    "extrasPrice",
    "hasBreakfast",
    "observations",
    "isPaid",
    "status",
  ];

  const updateData = updatedFields(data, fields);

  if (
    "cabinId" in updateData ||
    "numNights" in updateData ||
    "numGuests" in updateData ||
    "hasBreakfast" in updateData ||
    "extrasPrice" in updateData
  ) {
    updateData.cabinPrice = rules.resource.cabinPrice;
    updateData.totalPrice = rules.resource.finalTotalPrice;
  }

  await Booking.update(updateData, { where: { id } });

  const updatedBooking = await Booking.findByPk(id);

  const bookingObj = updatedBooking.toJSON();

  return { resource: bookingObj, error: null, status: 200 };
}

async function deleteBooking(id) {
  const existingBooking = await findById(Booking, id);
  if (!existingBooking) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Reserva"),
      status: 404,
    };
  }
  await Booking.destroy({ where: { id } });
  return { resource: null, error: null, status: 200 };
}

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
