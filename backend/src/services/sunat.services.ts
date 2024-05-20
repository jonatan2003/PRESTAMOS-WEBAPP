import axios from 'axios';

const PERSONA_ID = '6642b4d680b7c00015d239e0';
const PERSONA_TOKEN = 'DEV_smduUDo3UV3VeqKO8gEzk8Y7Kix1FBEozAmhTS9Add53ZNAYAaoPDtDrJoMY6irD';
const AUTH_TOKEN = `${PERSONA_ID}+${PERSONA_TOKEN}`;

const API_URL = 'https://back.apisunat.com';

export const getDNIInfo = async (dni: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/dni/${dni}`, {
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRUCInfo = async (ruc: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/ruc/${ruc}`, {
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
