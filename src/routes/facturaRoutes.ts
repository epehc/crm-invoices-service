import {Router} from "express";
import {body, param} from "express-validator";
import {
    createFactura,
    deleteFactura,
    getFacturaByFacturaId,
    getFacturas,
    getFacturasByClienteId,
    updateFactura
} from "../controllers/facturaController";
import {authenticateJWT} from "@epehc/sharedutilities/middlewares/authMiddleware";
import {authorize} from "@epehc/sharedutilities/middlewares/authorize";
import {UserRole} from "@epehc/sharedutilities/enums/userRole";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Factura:
 *       type: object
 *       required:
 *         - factura_id
 *         - fecha
 *         - cliente_id
 *         - nit
 *         - total
 *         - estado
 *         - productos
 *       properties:
 *         factura_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the factura
 *         fecha:
 *           type: string
 *           format: date
 *           description: The date of the factura
 *         cliente_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the cliente
 *         nit:
 *           type: string
 *           description: The NIT of the cliente
 *         total:
 *           type: number
 *           format: float
 *           description: The total amount of the factura
 *         estado:
 *           type: string
 *           description: The status of the factura
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *           description: The list of products in the factura
 */

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Get all facturas
 *     tags: [Facturas]
 *     responses:
 *       200:
 *         description: The list of facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 */
router.get('/',
    authenticateJWT,
    authorize([UserRole.Admin]),
    getFacturas);

/**
 * @swagger
 * /facturas/{factura_id}:
 *   get:
 *     summary: Get a factura by ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: factura_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The factura ID
 *     responses:
 *       200:
 *         description: The factura description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura not found
 */
router.get('/:factura_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('factura_id').isNumeric()
    ],
    getFacturaByFacturaId);

/**
 * @swagger
 * /facturas/cliente/{cliente_id}:
 *   get:
 *     summary: Get facturas by cliente ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The cliente ID
 *     responses:
 *       200:
 *         description: The list of facturas by cliente ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura not found
 */
router.get('/cliente/:client_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('client_id').isUUID()
    ],
    getFacturasByClienteId);


/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Create a new factura
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       201:
 *         description: The factura was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       400:
 *         description: Invalid input
 */
router.post('/',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        body('client_id').isUUID().notEmpty().withMessage('Cliente ID must be a valid UUID'),
        body('cliente_nombre').isString().notEmpty().withMessage('Cliente nombre must be a string'),
        body('estado').isString().notEmpty().withMessage('Estado must be a string'),
        body('fecha').isString().notEmpty().withMessage('Fecha must be a string'),
        body('fecha_vencimiento').isString().notEmpty().withMessage('Fecha vencimiento must be a string'),
        body('total').isNumeric().notEmpty().withMessage('Total must be a number'),
        body('iva').isNumeric().notEmpty().withMessage('IVA must be a number'),
        body('total_sin_iva').isNumeric().notEmpty().withMessage('Total sin IVA must be a number'),
        body('abonado').isNumeric().notEmpty().withMessage('Abonado must be a number'),
        body('saldo_pendiente').isNumeric().notEmpty().withMessage('Saldo pendiente must be a number'),
        body('nit').isString().notEmpty().withMessage('NIT must be a string'),
        body('descripcion').isString().notEmpty().withMessage('Descripcion must be a string'),
    ],
    createFactura);

/**
 * @swagger
 * /facturas/{factura_id}:
 *   put:
 *     summary: Update a factura by ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: factura_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The factura ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       200:
 *         description: The factura was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Factura not found
 */
router.put('/:factura_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('factura_id').isNumeric(),
        body('client_id').isUUID(),
        body('cliente_nombre').isString(),
        body('estado').isString(),
        body('fecha').optional().isString(),
        body('fecha_vencimiento').optional().isString(),
        body('total').optional().isFloat(),
        body('iva').optional().isFloat(),
        body('total_sin_iva').optional().isFloat(),
        body('abonado').optional().isFloat(),
        body('saldo_pendiente').optional().isFloat(),
        body('nit').isString(),
        body('descripcion').optional().isString(),
    ],
    updateFactura);

/**
 * @swagger
 * /facturas/{factura_id}:
 *   delete:
 *     summary: Delete a factura by ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: factura_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The factura ID
 *     responses:
 *       204:
 *         description: The factura was successfully deleted
 *       404:
 *         description: Factura not found
 */
router.delete('/:factura_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('factura_id').isNumeric()
    ],
    deleteFactura);

export default router;