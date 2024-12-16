import {Request, Response} from 'express';
import Pago from '../models/pago';

export const getAllPagos = async (req: Request, res: Response) => {
    try {
        const pagos = await Pago.findAll();
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch pagos'});
    }
}

export const getPagoByPagoId = async (req: Request, res: Response) => {
    try {
        const {pago_id} = req.params;
        const pago = await Pago.findByPk(pago_id);
        if (pago) {
            res.status(200).json(pago);
        } else {
            res.status(404).json({error: 'Pago not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch pago'});
    }
}

export const getPagosByFacturaId = async (req: Request, res: Response) => {
    try {
        const {factura_id} = req.params;
        const pagos = await Pago.findAll({where: {factura_id}});
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch pagos'});
    }
}

export const createPago = async (req: Request, res: Response) => {
    try {
        const pago = await Pago.create(req.body);
        res.status(201).json(pago);
    } catch (error) {
        res.status(500).json({error: 'Failed to create pago'});
    }
}

export const updatePago = async (req: Request, res: Response) => {
    try {
        const {pago_id} = req.params;
        const pago = await Pago.findByPk(pago_id);
        if (pago) {
            await pago.update(req.body);
            res.status(200).json(pago);
        } else {
            res.status(404).json({error: 'Pago not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to update pago'});
    }
}

export const deletePago = async (req: Request, res: Response) => {
    try {
        const {pago_id} = req.params;
        const pago = await Pago.findByPk(pago_id);
        if (pago) {
            await pago.destroy();
            res.status(204).json();
        } else {
            res.status(404).json({error: 'Pago not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to delete pago'});
    }
}