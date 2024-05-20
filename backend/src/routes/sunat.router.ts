import { Router } from 'express';
import { consultarDNI, consultarRUC } from '../controllers/sunat.controller';

const routerSUNAT = Router();

routerSUNAT.get('/dni/:dni', consultarDNI);
routerSUNAT.get('/ruc/:ruc', consultarRUC);

export default routerSUNAT;
