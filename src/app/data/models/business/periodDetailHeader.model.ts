import { PeriodModel } from "./period.model";

export class PeriodDetailHeader {
    constructor(
       public amountEstimado: number = 0.0,
       public period:         PeriodModel = new PeriodModel(),
       public saving:         number = 0.0,
       public totalSpent:     number = 0.0
    ){}
}