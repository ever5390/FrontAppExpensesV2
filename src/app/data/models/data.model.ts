import { IDataStructure } from "../interfaces/data.interface";

export class DataStructure implements IDataStructure{
    constructor(
        public item: string = '',
        public title: string = '',
        public titleDos?: string,
        public imagen: string = '',
        public onlyListItems?: boolean,
        public lista?: any[]
    ){}

}