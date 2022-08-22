import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";


@Injectable({
providedIn: 'root'
})
export class UtilService {
    
    private subject$ = new Subject<any>();
    private subjectDates$ = new Subject<any>();
    private subjectItemFilterSelected$ = new Subject<any>();

    constructor() { }

    convertDateToString(inputDate:Date): string {
        //expense?dateBegin=2022-07-19T17:42:53&dateEnd=2022-07-19T17:42:59
        
        let date = new Date(inputDate);
        return date.getUTCFullYear() + "-" + this.setAndGetTwoDigits(date.getUTCMonth()+1, "") + "-" + 
               this.setAndGetTwoDigits(date.getUTCDate(), "")+ "T" + this.setAndGetTwoDigits(date.getUTCHours(), "hour") + ":" + 
               this.setAndGetTwoDigits(date.getUTCMinutes(), "") + ":" + this.setAndGetTwoDigits(date.getUTCSeconds(), "");
    }

    convertDateGMTToString(inputDate:Date, type: string): string {
        //expense?dateBegin=2022-07-19T17:42:53&dateEnd=2022-07-19T17:42:59
        
        let date = new Date(inputDate);
        let dateFormattedInitial = date.getFullYear() + "-" + this.setAndGetTwoDigits(date.getMonth()+1, "") + "-" + 
        this.setAndGetTwoDigits(date.getDate(), "") + "T00:00:00";

        let dateFormattedFinal = date.getFullYear() + "-" + this.setAndGetTwoDigits(date.getMonth()+1, "") + "-" + 
        this.setAndGetTwoDigits(date.getDate(), "") + "T" + this.setAndGetTwoDigits(date.getHours(), "hour") + ":" + 
        this.setAndGetTwoDigits(date.getMinutes(), "") + ":" + this.setAndGetTwoDigits(date.getSeconds(), "");

        return  (type == "final")?dateFormattedFinal:dateFormattedInitial;
    }

    getDateAddHoursOffset(value: string, order : string): Date {

        //Validate order :: plus or minus
        let valueProduct = 1;
        if(order != "plus") {
            valueProduct = -1;
        }
        //Create Date object from ISO string
        let date = new Date(value);
        //Get ms for date
        let time = date.getTime();
        //Check if timezoneOffset is positive or negative
        if (date.getTimezoneOffset() <= 0) {
          //Convert timezoneOffset to hours and add to Date value in milliseconds                              
          let final = time + valueProduct*(-1*Math.abs(date.getTimezoneOffset() * 60000));
          //Convert from milliseconds to date and convert date back to ISO string                              
          date = new Date(final);
        } else {
          let final = time + valueProduct*(Math.abs(date.getTimezoneOffset() * 60000));
          date = new Date(final);
        }
    
        return date;
    }

    setAndGetTwoDigits(valueTime: number, isHourParam: string) : string {
        let isHour = (isHourParam != "")?23:59;
        let valueTimeResponse = (valueTime<10)?"0"+valueTime:valueTime;
        let response = (valueTime == 0)?isHour.toString():valueTimeResponse.toString();
        return response;
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

    sendDatesFromCalendarSelected(objectSend:any) {
        this.subjectDates$.next(objectSend);
    }

    receivingdDatesFromCalendarSelected():Observable<any> {
        return this.subjectDates$.asObservable();
    }
    
}