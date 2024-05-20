import { Request, Response } from 'express';
import * as sunatService from '../services/sunat.services';
import axios, { AxiosError } from 'axios';

export const consultarDNI = async (req: Request, res: Response): Promise<void> => {
    const { dni } = req.params;
    if (!dni) {
        res.status(400).json({ error: 'Número de DNI no proporcionado' });
        return;
    }

    try {
        const data = await sunatService.getDNIInfo(dni);
        res.json(data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                res.status(axiosError.response.status).json({ error: axiosError.response.data });
            } else {
                res.status(500).json({ error: 'Error de red o el servidor no respondió' });
            }
        } else {
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
};

export const consultarRUC = async (req: Request, res: Response): Promise<void> => {
    const { ruc } = req.params;
    if (!ruc) {
        res.status(400).json({ error: 'Número de RUC no proporcionado' });
        return;
    }

    try {
        const data = await sunatService.getRUCInfo(ruc);
        res.json(data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                res.status(axiosError.response.status).json({ error: axiosError.response.data });
            } else {
                res.status(500).json({ error: 'Error de red o el servidor no respondió' });
            }
        } else {
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
};
