import {Request, Response} from 'express';
import Factura from '../models/factura';
import logger from "../utils/logger";
import {validationResult} from "express-validator";

export const getAllFacturas = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const facturas = await Factura.findAll();
        logger.info('Facturas fetched successfully');
        res.status(200).json(facturas);
    } catch (error) {
        logger.error('Error al obtener facturas: ', error);
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const getFacturaByFacturaId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {factura_id} = req.params;
        const factura = await Factura.findByPk(factura_id);
        if (factura) {
            logger.info('Factura fetched successfully');
            res.status(200).json(factura);
        } else {
            logger.error('Factura no encontrada');
            res.status(404).json({error: 'Factura not found'});
        }
    } catch (error) {
        logger.error('Error al obtener factura: ', error);
        res.status(500).json({error: 'Failed to fetch factura'});
    }
}

export const getFacturasByClienteId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {cliente_id} = req.params;
        const facturas = await Factura.findAll({where: {cliente_id}});
        logger.info('Facturas fetched successfully');
        res.status(200).json(facturas);
    } catch (error) {
        logger.error('Error al obtener facturas: ', error);
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const getFacturasByNit = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try{
        const {nit} = req.params;
        const facturas = await Factura.findAll({where: {nit}});
        logger.info('Facturas fetched successfully');
        res.status(200).json(facturas);
    }
    catch (error){
        logger.error('Error al obtener facturas: ', error);
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const createFactura = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const factura = await Factura.create(req.body);
        logger.info('Factura created successfully');
        res.status(201).json(factura);
    } catch (error) {
        logger.error('Error al crear factura: ', error);
        res.status(500).json({error: 'Failed to create factura'});
    }
}

export const updateFactura = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {factura_id} = req.params;
        const factura = await Factura.findByPk(factura_id);
        if (factura) {
            await factura.update(req.body);
            logger.info(`Factura ${factura_id} updated successfully`);
            res.status(200).json(factura);
        } else {
            logger.error('Factura no encontrada');
            res.status(404).json({error: 'Factura not found'});
        }
    } catch (error) {
        logger.error('Error al actualizar factura: ', error);
        res.status(500).json({error: 'Failed to update factura'});
    }
}

export const deleteFactura = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al asignar roles: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {factura_id} = req.params;
        const factura = await Factura.findByPk(factura_id);
        if (factura) {
            await factura.destroy();
            logger.info(`Factura ${factura_id} deleted successfully`);
            res.status(204).send();
        } else {
            logger.error('Factura no encontrada');
            res.status(404).json({error: 'Factura not found'});
        }
    } catch (error) {
        logger.error('Error al eliminar factura: ', error);
        res.status(500).json({error: 'Failed to delete factura'});
    }
}