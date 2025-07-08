const { Op, Sequelize } = require("sequelize");
const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");
const MESSAGES = require("../utils/messages");
const findById = require("../utils/findById");
const updatedFields = require("../utils/updatedFields");
const checkOverlap = require("../utils/checkOverlap");
const validateBusinessRules = require("../utils/validateBusinessRules");
const calculateNumNights = require("../utils/calculateNumNights");

async function getAllBookingsDashboard({ days = 7 }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filterStart = new Date(today);
  filterStart.setDate(filterStart.getDate() - days + 1);

  const bookingsForStats = await Booking.findAll({
    where: {
      startDate: { [Op.gte]: filterStart, [Op.lte]: today },
    },
    include: [{ model: Guest, as: "guest", attributes: ["fullName", "email"] }],
  });

  const bookingsTodayRaw = await Booking.findAll({
    where: {
      startDate: { [Op.eq]: today },
    },
    attributes: ["guestId", "numNights", "status"],
  });

  const guestIdsToday = bookingsTodayRaw.map((b) => b.guestId);
  const guestsToday = await Guest.findAll({
    where: { id: { [Op.in]: guestIdsToday } },
    attributes: ["id", "fullName", "nationality"],
  });

  const guestMap = {};
  guestsToday.forEach((g) => {
    guestMap[g.id] = {
      id: g.id,
      fullName: g.fullName,
      nationality: g.nationality,
    };
  });

  const bookingsToday = bookingsTodayRaw
    .filter((b) => b.status === "checked-in" || b.status === "unconfirmed")
    .map((b) => ({
      id: guestMap[b.guestId]?.id || null,
      nationality: guestMap[b.guestId]?.nationality || null,
      fullName: guestMap[b.guestId]?.fullName || null,
      numNights: b.numNights,
      status: b.status,
    }));

  const total = bookingsForStats.length;
  const totalRevenue = bookingsForStats.reduce(
    (sum, b) => sum + Number(b.totalPrice),
    0
  );
  const checkedInBookings = bookingsForStats.filter(
    (b) => b.status === "checked-in"
  ).length;

  const totalCabins = await Cabin.count();
  const activeBookings = bookingsForStats.filter(
    (b) => b.status === "checked-in" || b.status === "unconfirmed"
  ).length;
  const occupancyRate =
    totalCabins > 0 ? (activeBookings / totalCabins) * 100 : 0;

  const nightRanges = { "2-3": 0, "4-5": 0, "8-14": 0 };
  bookingsForStats.forEach((booking) => {
    if (booking.numNights >= 2 && booking.numNights <= 3) nightRanges["2-3"]++;
    else if (booking.numNights >= 4 && booking.numNights <= 5)
      nightRanges["4-5"]++;
    else if (booking.numNights >= 8 && booking.numNights <= 14)
      nightRanges["8-14"]++;
  });

  const salesMap = {};
  bookingsForStats.forEach((b) => {
    const date = b.startDate.toISOString().slice(0, 10);
    if (!salesMap[date]) salesMap[date] = 0;
    salesMap[date] += Number(b.totalPrice);
  });
  const salesData = Object.entries(salesMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue: revenue.toFixed(2) }));

  return {
    resource: {
      total,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      checkedInBookings,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      bookingsToday,
      nightRanges,
      salesChart: salesData,
    },
    error: null,
    status: 200,
  };
}

async function getAllBookings({ where, orderBy, order, limit, offset, page }) {
  const bookings = await Booking.findAndCountAll({
    where,
    include: [{ model: Guest, as: "guest", attributes: ["fullName", "email"] }],
    order: [
      [orderBy, order && order.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ],
    limit,
    offset,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingsList = bookings.rows.map((booking) => {
    const startDate = new Date(booking.startDate);
    startDate.setHours(0, 0, 0, 0);
    const daysUntilStart = Math.ceil((startDate - today) / (1000 * 3600 * 24));

    return {
      id: booking.id,
      cabinId: booking.cabinId,
      "guest.fullName": booking.guest?.fullName,
      "guest.email": booking.guest?.email,
      daysUntilStart,
      numNights: booking.numNights,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
      totalPrice: booking.totalPrice,
    };
  });

  const pageCount = limit > 0 ? Math.ceil(bookings.count / limit) : 1;

  return {
    resource: {
      bookings: bookingsList,
      page,
      limit,
      pageCount,
    },
    error: null,
    status: 200,
  };
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
      status: 404,
      errorCode: "BOOKING_NOT_FOUND",
      message: MESSAGES.GENERAL.NOT_FOUND("Reserva"),
      source: "bookingService.getBookingById",
      detalhes: null,
      resource: null,
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
    numGuests,
    extrasPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
  } = data;

  const numNights = calculateNumNights(startDate, endDate);

  const cabin = await Cabin.findByPk(cabinId);
  const guest = await Guest.findByPk(guestId);

  if (!cabin) {
    return {
      status: 404,
      errorCode: "CABIN_NOT_FOUND",
      message: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
      source: "bookingService.createBooking - cabin",
      detalhes: null,
      resource: null,
    };
  }
  if (!guest) {
    return {
      status: 404,
      errorCode: "GUEST_NOT_FOUND",
      message: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
      source: "bookingService.createBooking - guest",
      detalhes: null,
      resource: null,
    };
  }

  const overlap = await checkOverlap({ cabinId, startDate, endDate });
  if (overlap.error) return overlap;

  const rules = await validateBusinessRules({
    cabinId,
    guestId,
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
      status: 404,
      errorCode: "BOOKING_NOT_FOUND",
      message: MESSAGES.GENERAL.NOT_FOUND("Reserva"),
      source: "bookingService.updateBooking",
      detalhes: null,
      resource: null,
    };
  }

  const getFinal = (newValue, currentValue) =>
    newValue !== undefined ? newValue : currentValue;

  const finalCabinId = getFinal(cabinId, existingBooking.cabinId);
  const finalGuestId = getFinal(guestId, existingBooking.guestId);
  const finalStartDate = getFinal(startDate, existingBooking.startDate);
  const finalEndDate = getFinal(endDate, existingBooking.endDate);
  let finalNumNights = existingBooking.numNights;
  if (startDate !== undefined || endDate !== undefined) {
    finalNumNights = calculateNumNights(finalStartDate, finalEndDate);
  }

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
      status: 404,
      errorCode: "BOOKING_NOT_FOUND",
      message: MESSAGES.GENERAL.NOT_FOUND("Reserva"),
      source: "bookingService.deleteBooking",
      detalhes: null,
      resource: null,
    };
  }
  await Booking.destroy({ where: { id } });
  return { resource: null, error: null, status: 200 };
}

module.exports = {
  getAllBookingsDashboard,
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
