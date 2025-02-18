import { Request, Response } from "express";
import Pago from "../../src/models/pago";
import {
  getPagosByFacturaId,
  createPago,
  // Optionally, you can add tests for procesarPago if needed
} from "../../src/controllers/pagoController";
import { validationResult } from "express-validator";

jest.mock("../../src/models/pago");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

const mockResponse = {
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
  send: jest.fn(),
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getPagosByFacturaId", () => {
  test("should return pagos for a given factura_id", async () => {
    const fakePagos = [
      { pago_id: "p1", factura_id: 1, fecha: "2025-02-18", monto: 100, boleta_pago: "BP1" },
    ];
    jest.spyOn(Pago, "findAll").mockResolvedValue(fakePagos as any);

    const req = { params: { factura_id: "1" } } as unknown as Request;
    await getPagosByFacturaId(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(fakePagos);
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid factura_id" }],
    });
    const req = { params: {} } as unknown as Request;
    await getPagosByFacturaId(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ errors: [{ msg: "Invalid factura_id" }] });
  });
});

describe("createPago", () => {
  test("should create a pago successfully", async () => {
    const reqBody = {
      factura_id: 1,
      fecha: "2025-02-18",
      monto: 100,
      boleta_pago: "BP1",
    };

    const fakePago = {
      pago_id: "some-uuid",
      ...reqBody,
    };

    jest.spyOn(Pago, "create").mockResolvedValue(fakePago as any);
    const req = { body: reqBody } as unknown as Request;

    await createPago(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(fakePago);
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { body: {} } as unknown as Request;
    await createPago(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }]
    });
  });
});
