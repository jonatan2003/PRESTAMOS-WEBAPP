import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';

export const consultarDNI = async (req: Request, res: Response) => {
    const { dni } = req.params;
    if (!dni) {
        return res.status(400).json({ error: 'Número de DNI no proporcionado' });
    }

    const TOKEN = 'apis-token-8502.V8xGpjroe3FUxxsUPSU8ddgp6nybb1de'; // Reemplaza 'YOUR_TOKEN_HERE' con tu token real

    try {
        const response = await axios.get(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        });

        // Devuelve los datos de la respuesta de la API Reniec
        res.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                res.status(axiosError.response.status).json({ error: axiosError.response.data });
            } else {
                // Error de red o el servidor no respondió
                res.status(500).json({ error: 'Error de red o el servidor no respondió' });
            }
        } else {
            // Otro tipo de error
            res.status(500).json({ error: 'Error desconocido' });
        }
    }
};
