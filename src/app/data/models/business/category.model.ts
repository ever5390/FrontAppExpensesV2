import { CONSTANTES } from "app/data/constantes";
import { GroupModel } from "./group.model";
import { OwnerModel } from "./owner.model";

export class CategoryModel {
    constructor(
        public active: boolean = false,
        public group:  GroupModel = new GroupModel(),
        public name: string = '',
        public id:    number = 0,
        public image: string = CONSTANTES.CONST_IMAGEN_DEFAULT,
        public owner:  OwnerModel = new OwnerModel(),
        public isDisabled: boolean = false //aditional only front
    ){}
}
