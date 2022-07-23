import { CONSTANTES } from "app/data/constantes";
import { AccountModel } from "../business/account.model";
import { GroupModel } from "../business/group.model";

export class ObjectFormularioShared {
    constructor(
        public name:string = '',
        public monto:string = '',
        public image: string = CONSTANTES.CONST_IMAGEN_DEFAULT,
        public inputDisabled: boolean = false,
        public group: GroupModel = new GroupModel(),
        public origen: AccountModel = new AccountModel(),
        public destino: AccountModel = new AccountModel()
    ){

    }
}