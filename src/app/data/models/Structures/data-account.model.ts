import { AccountModel } from "../business/account.model";

export class AccountClosedStructure {
    constructor(
        public account: AccountModel = new AccountModel(),
        public amountInitial: number = 0,
        public spent: number = 0,
        public diferenciaAmountByStatus: number = 0
    ){}
}