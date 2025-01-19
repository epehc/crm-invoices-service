import {Router} from "express";
import {body, param} from "express-validator";
import {
    createFactura,
    deleteFactura,
    getAllFacturas,
    getFacturaByFacturaId,
    getFacturasByClienteId,
    getFacturasByNit, getLatestFacturas, updateFactura
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
    getAllFacturas);

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
        param('factura_id').isUUID()
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
router.get('/cliente/:cliente_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('cliente_id').isUUID()
    ],
    getFacturasByClienteId);

/**
 * @swagger
 * /facturas/nit/{nit}:
 *   get:
 *     summary: Get facturas by NIT
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: nit
 *         schema:
 *           type: string
 *         required: true
 *         description: The NIT of the cliente
 *     responses:
 *       200:
 *         description: The list of facturas by NIT
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura not found
 */
router.get('/nit/:nit',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('nit').isString()
    ],
    getFacturasByNit);

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
        body('factura_id').isUUID(),
        body('fecha').isDate(),
        body('cliente_id').isUUID(),
        body('nit').isString(),
        body('total').isFloat(),
        body('estado').isString(),
        body('productos').isArray(),
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
        param('factura_id').isUUID(),
        body('fecha').isDate(),
        body('cliente_id').isUUID(),
        body('nit').isString(),
        body('total').isFloat(),
        body('estado').isString(),
        body('productos').isArray(),
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
        param('factura_id').isUUID()
    ],
    deleteFactura);

router.get('/latest',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('factura_id').isUUID()
    ],
    getLatestFacturas)

export default router;