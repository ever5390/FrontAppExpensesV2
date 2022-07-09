import { IDataStructureListShared } from "../interfaces/data-structure-list-shared.interface";

export class DataStructureListShared implements IDataStructureListShared{
    constructor(
        public component: string = '',
        public title: string = '',
        public titleDos?: string,
        public imagen: string = '',
        public onlyListItems?: boolean,
        public lista?: any[],
        public objectOfLista?: any
    ){}
    
    

}