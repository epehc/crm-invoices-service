jest.mock('../../node_modules/@epehc/sharedutilities/middlewares/authMiddleware', () => ({
  authenticateJWT: (req: any, res: any, next: any) => next()
}));
jest.mock('../../node_modules/@epehc/sharedutilities/middlewares/authorize', () => ({
  authorize: () => (req: any, res: any, next: any) => next()
}));

import * as pagoController from "../../src/controllers/pagoController";
// Stub the controller functions for the required endpoints.
jest.spyOn(pagoController, "getPagosByFacturaId").mockImplementation(async (req, res) => {
  res.status(200).json([
    { pago_id: "p1", factura_id: req.params.factura_id, fecha: "2025-02-18", monto: 100, boleta_pago: "BP1" }
  ]);
});
jest.spyOn(pagoController, "createPago").mockImplementation(async (req, res) => {
  res.status(201).json({ pago_id: "new-pago", ...req.body });
});

import request from "supertest";
import express from "express";
import pagoRoutes from "../../src/routes/pagoRoutes";

// Setup Express app with pagoRoutes mounted.
const app = express();
app.use(express.json());
app.use("/pagos", pagoRoutes);

describe("Pago Routes Integration Tests", () => {
  test("GET /pagos/factura/1 should return pagos for a given factura", async () => {
    const res = await request(app).get("/pagos/factura/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { pago_id: "p1", factura_id: "1", fecha: "2025-02-18", monto: 100, boleta_pago: "BP1" }
    ]);
  });

  test("POST /pagos should create a new pago", async () => {
    const newPago = {
      fecha: "2025-02-19",
      factura_id: "2",
      monto: 200,
      boleta_pago: "BP2"
    };
    const res = await request(app).post("/pagos").send(newPago);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ pago_id: "new-pago", ...newPago });
  });
});
