import { CategoryModel } from "./category.model";
import { PeriodModel } from "./period.model";

export class AccountModel {
    constructor(
        public accountName:   string = '',
        public accountNumber: string = '',
        public accountType:   AccountTypeModel = new AccountTypeModel(),
        public active:        boolean = true,
        public balance:       number = 0,
        public balanceFlow:   number = 0,
        public categories:    CategoryModel[] = [],
        public createdAt:     Date = new Date(),
        public id:            number = 0,
        public period:        PeriodModel = new PeriodModel(),
        public statusAccount: TypeSatusAccountOPC = TypeSatusAccountOPC.INITIAL,
    ){}
}

export enum TypeSatusAccountOPC {
	
	INITIAL= "INITIAL",
	PROCESS = "PROCESS",
	CLOSED = "CLOSED"
}

export class AccountTypeModel {
    constructor(
        public id: number = 0,
        public typeName: string = ''
    ){}
}