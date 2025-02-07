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
import {authenticateJWT} from "@epehc/sharedutilities/middlewares/authMiddleware";
import {authorize} from "@epehc/sharedutilities/middlewares/authorize";
import {UserRole} from "@epehc/sharedutilities/enums/userRole";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pago:
 *       type: object
 *       required:
 *         - pago_id
 *         - factura_id
 *         - fecha
 *         - monto
 *         - monto_retenido
 *         - boleta_pago
 *       properties:
 *         pago_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the pago
 *         factura_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the factura
 *         fecha:
 *           type: string
 *           format: date
 *           description: The date of the pago
 *         monto:
 *           type: number
 *           format: float
 *           description: The amount of the pago
 *         monto_retenido:
 *           type: number
 *           format: float
 *           description: The retained amount of the pago
 *         boleta_pago:
 *           type: string
 *           description: The payment receipt number
 */

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Get all pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: The list of pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 */
router.get('/',
    authenticateJWT,
    authorize([UserRole.Admin]),
    getAllPagos);

/**
 * @swagger
 * /pagos/{pago_id}:
 *   get:
 *     summary: Get a pago by ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: pago_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The pago ID
 *     responses:
 *       200:
 *         description: The pago description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago not found
 */
router.get('/:pago_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('pago_id').isUUID()
    ],
    getPagoByPagoId);

/**
 * @swagger
 * /pagos/factura/{factura_id}:
 *   get:
 *     summary: Get pagos by factura ID
 *     tags: [Pagos]
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
 *         description: The list of pagos by factura ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago not found
 */
router.get('/factura/:factura_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('factura_id').isNumeric()
    ],
    getPagosByFacturaId);

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Create a new pago and update the associated factura
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: The pago was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Invalid input
 */
router.post('/',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        //body('pago_id').isUUID(),
        body('fecha').isString().withMessage('Date format invalid'),
        body('factura_id').isNumeric(),
        body('monto').isFloat(),
        body('boleta_pago').isString(),
    ],
    createPago);

/**
 * @swagger
 * /pagos/{pago_id}:
 *   put:
 *     summary: Update a pago by ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: pago_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The pago ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       200:
 *         description: The pago was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pago not found
 */
router.put('/:pago_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('pago_id').isUUID(),
        body('fecha').isDate(),
        body('factura_id').isNumeric(),
        body('monto').isFloat(),
        body('boleta_pago').isString(),
    ],
    updatePago);

/**
 * @swagger
 * /pagos/{pago_id}:
 *   delete:
 *     summary: Delete a pago by ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: pago_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The pago ID
 *     responses:
 *       204:
 *         description: The pago was successfully deleted
 *       404:
 *         description: Pago not found
 */
router.delete('/:pago_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('pago_id').isUUID()
    ],
    deletePago);

export default router;