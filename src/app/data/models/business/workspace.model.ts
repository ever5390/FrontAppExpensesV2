import { OwnerModel } from "./owner.model";

export class Workspace {
    constructor(
        public id:       number = 1,
        public name:     string = '',
        public active:     boolean = false,
        public owner:    OwnerModel = new OwnerModel(),
        public typeWSPC: TypeWSPC = new TypeWSPC(),
    ){}
}

export class TypeWSPC {
    constructor(
        public id:       number = 0,
        public typeName: string = ''
    ){}
}
