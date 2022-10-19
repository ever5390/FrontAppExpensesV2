import { GroupModel } from "@data/models/business/group.model";

export interface IStructureFormShared {
    imgDefault: File | null,
    listaShow: boolean,
    lista: any[],
    object: any,
    txtActionBtn: string,
    component: string
}