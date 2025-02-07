import {Request, Response} from 'express';
import Pago from '../models/pago';
import logger from "../utils/logger";
import {validationResult} from "express-validator";
import Factura from '../models/factura';
import {v4 as uuidv4} from 'uuid';


export const getAllPagos = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const pagos = await Pago.findAll();
        logger.info('Pagos fetched successfully');
        res.status(200).json(pagos);
    } catch (error) {
        logger.error('Error al obtener pagos: ', error);
        res.status(500).json({error: 'Failed to fetch pagos'});
    }
}

export const getPagoByPagoId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {pago_id} = req.params;
        const pago = await Pago.findByPk(pago_id);
        if (pago) {
            logger.info('Pago fetched successfully');
            res.status(200).json(pago);
        } else {
            logger.error('Pago no encontrado');
            res.status(404).json({error: 'Pago not found'});
        }
    } catch (error) {
        logger.error('Error al obtener pago: ', error);
        res.status(500).json({error: 'Failed to fetch pago'});
    }
}

export const getPagosByFacturaId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const factura_id = req.params.factura_id;
        const pagos = await Pago.findAll({where: {factura_id}});
        logger.info('Pagos fetched successfully');
        res.status(200).json(pagos);
    } catch (error) {
        logger.error('Error al obtener pagos: ', error);
        res.status(500).json({error: 'Failed to fetch pagos'});
    }
}

export const procesarPago = async (factura_id: number, monto: number) => {
    try {
        const factura = await Factura.findByPk(factura_id);
        if (factura) {
            factura.abonado += monto;
            factura.saldo_pendiente -= monto;
            if(factura.saldo_pendiente <= 0) {
                factura.estado = 'pagada';
            }
            await factura.save();
            logger.info(`Factura ${factura_id} updated successfully`);
        } else {
            logger.error('Factura no encontrada');
        }
    } catch (error) {
        logger.error('Error al procesar pago: ', error);
    }
}

export const createPago = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {factura_id, fecha, monto, boleta_pago} = req.body;

        const pago = await Pago.create({
            pago_id: uuidv4(),
            factura_id,
            fecha,
            monto,
            boleta_pago
        });
        logger.info('Pago creado y procesado exitosamente');
        res.status(201).json(pago);
    } catch (error) {
        logger.error('Error al crear pago: ', error);
        res.status(500).json({error: 'Failed to create pago'});
    }
}

export const updatePago = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {pago_id} = req.params;
        const pago = await Pago.findByPk(pago_id);
        if (pago) {
            await pago.update(req.body);
            logger.info(`Pago ${pago_id} updated successfully`);
            res.status(200).json(pago);
        } else {
            logger.error('Pago no encontrado');
            res.status(404).json({error: 'Pago not found'});
        }
    } catch (error) {
        logger.error('Error al actualizar pago: ', error);
        res.status(500).json({error: 'Failed to update pago'});
    }
}

export const deletePago = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {pago_id} = req.params;
        const pago = await Pago.findByPk(pago_id);
        if (pago) {
            await pago.destroy();
            logger.info(`Pago ${pago_id} eliminado exitosamente`);
            res.status(204).json();
        } else {
            logger.error('Pago no encontrado');
            res.status(404).json({error: 'Pago not found'});
        }
    } catch (error) {
        logger.error('Error al eliminar pago: ', error);
        res.status(500).json({error: 'Failed to delete pago'});
    }
}

