import { CONSTANTES } from "@data/constantes";
import { IStructureFormShared } from "./shared-structure-form.interface";

export class StructureFormSharedModel implements IStructureFormShared{
    constructor(
       public imgDefault: File | null = null,
       public listaShow: boolean = false,
       public lista: any[] = [],
       public object: any = null,
       public txtActionBtn: string = CONSTANTES.CONST_TEXT_BTN_REGISTRAR,
       public component: string = ""
    ){}
}