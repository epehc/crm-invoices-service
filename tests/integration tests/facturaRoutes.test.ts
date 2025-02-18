jest.mock('../../node_modules/@epehc/sharedutilities/middlewares/authMiddleware', () => ({
  authenticateJWT: (req: any, res: any, next: any) => next()
}));
jest.mock('../../node_modules/@epehc/sharedutilities/middlewares/authorize', () => ({
  authorize: () => (req: any, res: any, next: any) => next()
}));

import * as facturaController from "../../src/controllers/facturaController";
// Stub controller functions to simulate responses.
jest.spyOn(facturaController, "getFacturas").mockImplementation(async (req, res) => {
  // Simulate paginated response.
  res.status(200).json({
    data: [{ factura_id: 1, client_id: "uuid1", cliente_nombre: "Test Factura" }],
    total: 1,
    totalPages: 1,
    currentPage: 1,
  });
});
jest.spyOn(facturaController, "getFacturasByClienteId").mockImplementation(async (req, res) => {
  // Instead of using req.params.client_id, return a fixed value.
  res.status(200).json([{ factura_id: 1, client_id: "uuid1", cliente_nombre: "Cliente Factura" }]);
});
jest.spyOn(facturaController, "createFactura").mockImplementation(async (req, res) => {
  res.status(201).json({ factura_id: 10, ...req.body });
});
jest.spyOn(facturaController, "updateFactura").mockImplementation(async (req, res) => {
  if (req.params.factura_id === "1") {
    res.status(200).json({ factura_id: 1, ...req.body });
  } else {
    res.status(404).json({ error: "Factura not found" });
  }
});

import request from "supertest";
import express from "express";
import facturaRoutes from "../../src/routes/facturaRoutes";

// Setup Express app with facturaRoutes mounted.
const app = express();
app.use(express.json());
app.use("/facturas", facturaRoutes);

describe("Factura Routes Integration Tests", () => {
  test("GET /facturas should return paginated facturas", async () => {
    const res = await request(app).get("/facturas").query({ page: 1, pageSize: 12 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [{ factura_id: 1, client_id: "uuid1", cliente_nombre: "Test Factura" }],
      total: 1,
      totalPages: 1,
      currentPage: 1,
    });
  });

  test("GET /facturas/cliente/uuid1 should return facturas by client_id", async () => {
    const res = await request(app).get("/facturas/cliente/uuid1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ factura_id: 1, client_id: "uuid1", cliente_nombre: "Cliente Factura" }]);
  });

  test("POST /facturas should create a new factura and return it", async () => {
    const newFactura = {
      client_id: "uuid-new",
      cliente_nombre: "New Factura",
      estado: "active",
      fecha: "2025-02-18",
      fecha_vencimiento: "2025-03-18",
      total: 1000,
      iva: 160,
      total_sin_iva: 840,
      abonado: 0,
      saldo_pendiente: 840,
      nit: "12345",
      descripcion: "New factura test"
    };
    const res = await request(app).post("/facturas").send(newFactura);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ factura_id: 10, ...newFactura });
  });

  test("PUT /facturas/1 should update factura when found", async () => {
    const updateData = { cliente_nombre: "Updated Factura" };
    const res = await request(app).put("/facturas/1").send(updateData);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ factura_id: 1, ...updateData });
  });

  test("PUT /facturas/999 should return 404 when updating non-existing factura", async () => {
    const res = await request(app)
      .put("/facturas/999")
      .send({ cliente_nombre: "Update" });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Factura not found" });
  });
});