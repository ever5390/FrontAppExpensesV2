import { ExpenseModel, Voucher } from "./expense.model";
import { OwnerModel } from "./owner.model";

export class NotificationExpense {

    constructor(
        public id:          number = 0,
        public payer:          OwnerModel = new OwnerModel(),
        public createAt:       Date = new Date(),
        public vouchers: Voucher[] = [],
        public comentarios: string = '',
        public expenseShared:       ExpenseModel = new ExpenseModel(),
        public statusNotification = TypeStatusNotificationExpense.POR_CONFIRMAR,
        public isEmisorUser: boolean = false,
        public subtitleText: string = ''){
    }
}

export enum TypeStatusNotificationExpense {
    CANCELADO = 'CANCELADO',
	PAGADO = 'PAGADO',
	PENDIENTE_PAGO = 'PENDIENTE_PAGO',
	POR_CONFIRMAR = 'POR_CONFIRMAR',
	RECHAZADO = 'RECHAZADO',
    RECLAMADO = 'RECLAMADO'
}

    

