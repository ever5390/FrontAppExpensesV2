export interface IExpenseReceivedShowHeaderExpense {
    total : number;
    availableAmount : number;
    dateBegin : string; 
    dateEnd : string;
    optionOrigin : string;
    flagIsPendingCollect : boolean;
    flagShowAvailableAmoount : boolean;
    flagIsPeriodFinalized : boolean;
}