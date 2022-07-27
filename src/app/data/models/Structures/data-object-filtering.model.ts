export class FilterExpensesModel {
    constructor(
        public id: number = 0,
        public name: string = '',
        public image: string = '',
        public active: boolean = false,
        public countItems: number = 0,
        public totalAmountSpent: number = 0,
        public component: string = 'componentDefault'
    ){}
}