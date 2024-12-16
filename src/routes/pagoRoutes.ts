import express from "express";
import {body, param} from "express-validator";
import {
    createPago,
    deletePago,
    getAllPagos,
    getPagoByPagoId,
    getPagosByFacturaId,
    updatePago
} from "../controllers/pagoController";

const router = express.Router()

router.get('/', getAllPagos);
router.get('/:pago_id', getPagoByPagoId);
router.get('/factura/:factura_id', getPagosByFacturaId);
router.post('/', [
    body('pago_id').isUUID(),
    body('fecha').isDate(),
    body('factura_id').isUUID(),
    body('monto').isFloat(),
], createPago);
router.put('/:pago_id', [
    param('pago_id').isUUID(),
    body('fecha').isDate(),
    body('factura_id').isUUID(),
    body('monto').isFloat(),
], updatePago);
router.delete('/:pago_id', deletePago);

export default router