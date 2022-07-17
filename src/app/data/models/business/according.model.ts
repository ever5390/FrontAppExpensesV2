import { CONSTANTES } from "app/data/constantes";

export class AccordingModel {

    constructor(
        public description: string = '',
        public id:          number = 0,
        public image:       string = CONSTANTES.CONST_IMAGEN_DEFAULT,
        public name:        string = ''){

    }
}

