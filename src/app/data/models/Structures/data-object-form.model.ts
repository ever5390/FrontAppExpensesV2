import { CONSTANTES } from "app/data/constantes";
import { GroupModel } from "../business/group.model";

export class ObjectFormularioShared {
    constructor(
        public name:string = '',
        public image: string = CONSTANTES.CONST_IMAGEN_DEFAULT,
        public group: GroupModel = new GroupModel()
    ){}
}