import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";


@Injectable({
providedIn: 'root'
})
export class UtilService {
    
    private subject$ = new Subject<any>();
    private subjectItemFilterSelected$ = new Subject<any>();

    constructor() { }

    convertDateToString(inputDate:Date): string {
        //expense?dateBegin=2022-07-19T17:42:53&dateEnd=2022-07-19T17:42:59
        let date = new Date(inputDate);
        return date.getUTCFullYear() + "-" + (date.getUTCMonth()+1) + "-" + 
               (date.getUTCDate())+ "T" + date.toLocaleTimeString();
    }

    sendTotalSpentToHeaderFromExpenseListMessage(objectSend:any) {
        this.subject$.next(objectSend);
    }

    receivingTotalSpentToHeaderFromExpenseListMessage():Observable<any> {
        return this.subject$.asObservable();
    }

    sendItemResumeSelected(objectSend:any) {
        this.subjectItemFilterSelected$.next(objectSend);
    }

    receivingItemResumeSelected():Observable<any> {
        return this.subjectItemFilterSelected$.asObservable();
    }
}