import { Request, Response } from "express";
import Factura from "../../src/models/factura";
import {
  getFacturas,
  getFacturasByClienteId,
  createFactura,
  updateFactura,
} from "../../src/controllers/facturaController";
import { validationResult } from "express-validator";

jest.mock("../../src/models/factura");
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

describe("getFacturas", () => {
  test("should return all facturas successfully", async () => {
    // Fake response from findAndCountAll with pagination data
    const fakeFacturas = [
      { factura_id: 1, client_id: "uuid-1", cliente_nombre: "Client A" },
    ];
    const count = 1;
    // Assume getFacturas calls Factura.findAndCountAll. (Update the spy method if you use a different query method.)
    jest
      .spyOn(Factura, "findAndCountAll")
      .mockResolvedValue({ count, rows: fakeFacturas } as any);

    const req = {
      query: { page: "1", pageSize: "10" },
    } as unknown as Request;

    await getFacturas(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: fakeFacturas,
        total: count,
        totalPages: Math.ceil(count / 10),
        currentPage: 1,
      })
    );
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { query: {} } as unknown as Request;
    await getFacturas(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });
});

describe("getFacturasByClienteId", () => {
  test("should return facturas for a given client_id", async () => {
    const fakeFacturas = [
      { factura_id: 1, client_id: "uuid-1", cliente_nombre: "Client A" },
    ];
    jest.spyOn(Factura, "findAll").mockResolvedValue(fakeFacturas as any);

    const req = { params: { client_id: "uuid-1" } } as unknown as Request;
    await getFacturasByClienteId(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(fakeFacturas);
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid client_id" }],
    });
    const req = { params: {} } as unknown as Request;
    await getFacturasByClienteId(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid client_id" }],
    });
  });
});

describe("createFactura", () => {
  test("should create a factura successfully", async () => {
    // Fake factura to be returned upon creation
    const fakeFactura = {
      factura_id: 1,
      client_id: "uuid-1",
      cliente_nombre: "Client A",
    };
    jest.spyOn(Factura, "create").mockResolvedValue(fakeFactura as any);

    const reqBody = {
      client_id: "uuid-1",
      cliente_nombre: "Client A",
      estado: "pending",
    };
    const req = { body: reqBody } as unknown as Request;

    await createFactura(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(fakeFactura);
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { body: {} } as unknown as Request;
    await createFactura(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });
});

describe("updateFactura", () => {
  test("should update factura successfully", async () => {
    const reqBody = { cliente_nombre: "Updated Client" };
    // Fake factura instance with update method that actually updates the field.
    const fakeFactura: any = {
      factura_id: 1,
      client_id: "uuid-1",
      cliente_nombre: "Client A",
      update: jest.fn().mockImplementation(async (data) => {
        // Update the fakeFactura with the new data.
        fakeFactura.cliente_nombre = data.cliente_nombre;
      }),
      toJSON: () => ({
        factura_id: fakeFactura.factura_id,
        client_id: fakeFactura.client_id,
        cliente_nombre: fakeFactura.cliente_nombre,
      }),
    };

    jest.spyOn(Factura, "findByPk").mockResolvedValue(fakeFactura);
    const req = { params: { factura_id: "1" }, body: reqBody } as unknown as Request;

    await updateFactura(req, mockResponse);

    expect(fakeFactura.update).toHaveBeenCalledWith(reqBody);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    
    // Capture the argument passed to json and verify the updated field is returned.
    const jsonArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(jsonArg).toMatchObject({
      factura_id: 1,
      client_id: "uuid-1",
      cliente_nombre: "Updated Client"
    });
  });

  test("should return 404 if factura is not found", async () => {
    jest.spyOn(Factura, "findByPk").mockResolvedValue(null);
    const req = { params: { factura_id: "1" }, body: { cliente_nombre: "Client A" } } as unknown as Request;

    await updateFactura(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Factura not found" });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { params: { factura_id: "1" }, body: {} } as unknown as Request;
    await updateFactura(req, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ errors: [{ msg: "Invalid input" }] });
  });
});
