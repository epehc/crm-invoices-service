import {Request, Response} from 'express';
import Pago from '../models/pago';
import logger from "../utils/logger";
import {validationResult} from "express-validator";

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
        const {factura_id} = req.params;
        const pagos = await Pago.findAll({where: {factura_id}});
        logger.info('Pagos fetched successfully');
        res.status(200).json(pagos);
    } catch (error) {
        logger.error('Error al obtener pagos: ', error);
        res.status(500).json({error: 'Failed to fetch pagos'});
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
        const pago = await Pago.create(req.body);
        logger.info('Pago creado exitosamente');
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