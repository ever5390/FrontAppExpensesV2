import { OwnerModel } from "./owner.model";

export class PaymentMethodModel {
    constructor(
        public active: boolean = true,
        public name:   string = '',
        public id:     number = 0,
        public image:  string = '',
        public owner:  OwnerModel = new OwnerModel()
    ){}
}