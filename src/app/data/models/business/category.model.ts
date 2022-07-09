import { GroupModel } from "./group.model";
import { OwnerModel } from "./owner.model";

export class CategoryModel {
    constructor(
        public active: boolean = false,
        public group:  GroupModel = new GroupModel(),
        public name: string = '',
        public id:    number = 0,
        public image: string = '',
        public owner:  OwnerModel = new OwnerModel()
    ){}
}
