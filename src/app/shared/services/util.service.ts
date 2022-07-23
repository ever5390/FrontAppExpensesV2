import { Injectable } from "@angular/core";


@Injectable({
providedIn: 'root'
})
export class UtilService {

    constructor() { }

    convertDateToString(inputDate:Date): string {
        //expense?dateBegin=2022-07-19T17:42:53&dateEnd=2022-07-19T17:42:59
        let date = new Date(inputDate);
        return date.getUTCFullYear() + "-" + (date.getUTCMonth()+1) + "-" + 
               (date.getUTCDate())+ "T" + date.toLocaleTimeString();
    }
}