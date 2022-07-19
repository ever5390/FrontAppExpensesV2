import { CONSTANTES } from "app/data/constantes";
import { IDataStructureListSharedFormShared } from "app/data/interfaces/data-register-form-shared.interface";

export class DataStructureFormShared implements IDataStructureListSharedFormShared{
    constructor(
        public component: string = '',
        public title: string = '',
        public titleDos?: string,
        public imagen: string = CONSTANTES.CONST_IMAGEN_DEFAULT,
        public action: string = '',
        public object:any = null,
        public listGroupOnlyCategory:any = [],
        public listAccoutOrigen:any=[]
        ){}
}
