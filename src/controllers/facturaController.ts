import {Request, Response} from 'express';
import Factura from '../models/factura';

export const getAllFacturas = async (req: Request, res: Response) => {
    try {
        const facturas = await Factura.findAll();
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const getFacturaByFacturaId = async (req: Request, res: Response) => {
    try {
        const {factura_id} = req.params;
        const factura = await Factura.findByPk(factura_id);
        if (factura) {
            res.status(200).json(factura);
        } else {
            res.status(404).json({error: 'Factura not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch factura'});
    }
}

export const getFacturasByClienteId = async (req: Request, res: Response) => {
    try {
        const {cliente_id} = req.params;
        const facturas = await Factura.findAll({where: {cliente_id}});
        res.status(200).json(facturas);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const getFacturasByNit = async (req: Request, res: Response) => {
    try{
        const {nit} = req.params;
        const facturas = await Factura.findAll({where: {nit}});
        res.status(200).json(facturas);
    }
    catch (errror){
        res.status(500).json({error: 'Failed to fetch facturas'});
    }
}

export const createFactura = async (req: Request, res: Response) => {
    try {
        const factura = await Factura.create(req.body);
        res.status(201).json(factura);
    } catch (error) {
        res.status(500).json({error: 'Failed to create factura'});
    }
}

export const updateFactura = async (req: Request, res: Response) => {
    try {
        const {factura_id} = req.params;
        const factura = await Factura.findByPk(factura_id);
        if (factura) {
            await factura.update(req.body);
            res.status(200).json(factura);
        } else {
            res.status(404).json({error: 'Factura not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to update factura'});
    }
}

export const deleteFactura = async (req: Request, res: Response) => {
    try {
        const {factura_id} = req.params;
        const factura = await Factura.findByPk(factura_id);
        if (factura) {
            await factura.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({error: 'Factura not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to delete factura'});
    }
}