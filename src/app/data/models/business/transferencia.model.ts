import { AccountModel } from "./account.model";
import { PeriodModel } from "./period.model";

export class TransferenciaModel {
    constructor(
        public accountDestiny:  AccountModel = new AccountModel(),
        public accountOrigin:   AccountModel = new AccountModel(),
        public amount:          string = '',
        public createDate:      Date = new Date(),
        public id:              number = 0,
        public period:          PeriodModel = new PeriodModel(),
        public reason:          string = '',
        public typeEntryExtern: boolean = false
    ){}

}