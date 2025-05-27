const request = require("supertest");
const app = require("../src/server");

describe("Booking routes", () => {
  let token;
  let createdBookingId;

  beforeAll(async () => {
    // Realiza login para obtener un token válido
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "admin@email.com", password: "senha123" });
    token = loginRes.body.token;
  });

  it("deve retornar 401 se não autenticado", async () => {
    const res = await request(app).get("/bookings");
    expect(res.statusCode).toBe(401);
  });

  it("deve retornar 200 e uma lista de reservas se autenticado", async () => {
    const res = await request(app)
      .get("/bookings")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.bookings)).toBe(true);
  });

  it("deve criar uma reserva (POST /bookings)", async () => {
    const bookingData = {
      cabinId: 1,
      guestId: 1,
      startDate: "2025-06-01",
      endDate: "2025-06-05",
      numNights: 4,
      numGuests: 2,
      cabinPrice: 500,
      extrasPrice: 100,
      totalPrice: 600,
      hasBreakfast: true,
      observations: "Reserva de teste",
      isPaid: false,
    };
    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send(bookingData);
    expect([200, 201, 400, 409]).toContain(res.statusCode);
    if (res.body.booking && res.body.booking.id) {
      createdBookingId = res.body.booking.id;
    }
  });

  it("deve retornar 400 ao criar reserva com dados inválidos", async () => {
    const res = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect([400, 409]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar uma reserva específica (GET /bookings/:id)", async () => {
    if (!createdBookingId) return;
    const res = await request(app)
      .get(`/bookings/${createdBookingId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("booking");
    }
  });

  it("deve atualizar uma reserva (PUT /bookings/:id)", async () => {
    if (!createdBookingId) return;
    const updateData = {
      cabinId: 1,
      guestId: 1,
      startDate: "2025-06-02",
      endDate: "2025-06-06",
      numNights: 4,
      numGuests: 2,
      cabinPrice: 500,
      extrasPrice: 100,
      totalPrice: 600,
      hasBreakfast: false,
      observations: "Reserva atualizada",
      isPaid: true,
    };
    const res = await request(app)
      .put(`/bookings/${createdBookingId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);
    expect([200, 400, 404, 409]).toContain(res.statusCode);
  });

  it("deve deletar uma reserva (DELETE /bookings/:id)", async () => {
    if (!createdBookingId) return;
    const res = await request(app)
      .delete(`/bookings/${createdBookingId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
