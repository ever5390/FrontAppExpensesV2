import { AccordingModel } from "./according.model";
import { CategoryModel } from "./category.model";
import { OwnerModel } from "./owner.model";
import { PaymentMethodModel } from "./payment-method.model";
import { PeriodModel } from "./period.model";
import { Workspace } from "./workspace.model";

export class ExpenseModel {
    constructor(
        public id:              number=0,
        public amount:          string = '',
        public amountShow:      string = '',
        public description:     string = '',
        public image:           string = '',
        public payer:           string = '',
        public createAt:        Date     = new Date(),
        public paymentMethod:   PaymentMethodModel = new PaymentMethodModel(),
        public isPendingPayment:boolean = false,
        public accordingType:   AccordingModel = new AccordingModel(),
        public category:        CategoryModel = new CategoryModel(),
        public registerPerson:  OwnerModel = new OwnerModel(),
        public period:          PeriodModel = new PeriodModel(),
        public workspace:       Workspace = new Workspace(),
        public tag:             Tag[] = []
    ){}
}

export class Tag {
    constructor(
        public id:     number = 0,
        public name:   string = ''
   ){}
}