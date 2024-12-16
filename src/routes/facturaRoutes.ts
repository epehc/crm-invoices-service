import {Router} from "express";
import {body, param} from "express-validator";
import {
    createFactura,
    deleteFactura,
    getAllFacturas,
    getFacturaByFacturaId,
    getFacturasByClienteId,
    getFacturasByNit, updateFactura
} from "../controllers/facturaController";


const router = Router()

router.get('/', getAllFacturas);
router.get('/:factura_id', getFacturaByFacturaId);
router.get('/cliente/:cliente_id', getFacturasByClienteId);
router.get('/nit/:nit', getFacturasByNit);
router.post('/', [
    body('factura_id').isUUID(),
    body('fecha').isDate(),
    body('cliente_id').isUUID(),
    body('nit').isString(),
    body('total').isFloat(),
    body('estado').isString(),
    body('productos').isArray(),
], createFactura);
router.put('/:factura_id', [
    param('factura_id').isUUID(),
    body('fecha').isDate(),
    body('cliente_id').isUUID(),
    body('nit').isString(),
    body('total').isFloat(),
    body('estado').isString(),
    body('productos').isArray(),
], updateFactura);
router.delete('/:factura_id', deleteFactura);

export default router;