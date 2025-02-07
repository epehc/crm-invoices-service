import {Request, Response} from 'express';
import Factura from '../models/factura';
import logger from "../utils/logger";
import {validationResult} from "express-validator";
import { Op } from 'sequelize';


export const getAllFacturas = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al cargar facturas: ', errors);
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


export const getFacturas = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al cargar facturas: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 12;
        
        const offset = (page - 1) * pageSize;

        const query = req.query.query ? req.query.query.toString() : '';
        console.log("Query: ", req.query);

        const whereClause = query ? {
            [Op.or]: [
                { cliente_nombre: { [Op.iLike]: `%${query}%` } },
                { estado: { [Op.iLike]: `%${query}%` } },
                { nit: { [Op.iLike]: `%${query}%` } },
                { fecha: { [Op.iLike]: `%${query}%` } },
            ]
        } : {};

        const {count, rows: facturas} = await Factura.findAndCountAll({
            where: whereClause,
            offset,
            limit: pageSize
        });
        logger.info('Facturas fetched successfully');
        res.status(200).json({
            data: facturas,
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page
        });
    } catch (error) {
        logger.error('Error al obtener facturas: ', error);
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const getFacturaByFacturaId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al cargar factura: ', errors);
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
        logger.error('Error al cargar las facturas del cliente: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const client_id = req.params.client_id;
        const facturas = await Factura.findAll({where: {client_id}});
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
        logger.error('Error al cargar las facturas asociadas con el nit: ', errors);
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
        logger.error('Error al generar factura: ', errors.array());
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
        logger.error('Error al actualizar factura: ', errors);
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
        logger.error('Error al borrar roles: ', errors);
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

export const getLatestFacturas = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al cargar facturas: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const facturas = await Factura.findAll({order: [['fecha', 'DESC']], limit: 10});
        logger.info('Facturas fetched successfully');
        res.status(200).json(facturas);
    } catch (error) {
        logger.error('Error al obtener facturas: ', error);
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const anularFactura = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al anular factura: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try{
        const {factura_id} = req.params;
        const factura = await Factura.findByPk(factura_id);
        if (factura){
            factura.estado = 'anulada';
            await factura.save();
            logger.info('Factura anulada exitosamente');
            res.status(200).json(factura);
        } else {
            logger.error('Factura no encontrada');
            res.status(404).json({error: 'Factura not found'});
        }
    } catch (error){
        logger.error('Error al anular factura: ', error);
        res.status(500).json({error: 'Failed to anular factura'});
    }
}