import { OwnerModel } from "./owner.model";

export class GroupModel {

    constructor(
        public  active:      boolean = true,
        public  description: string = '',
        public  icon:        string = '',
        public  id:          number = 0,
        public  name:        string = '',
        public  owner:       OwnerModel = new OwnerModel()
    ){
      
    }
    
}