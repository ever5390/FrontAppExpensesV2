import { Injectable } from "@angular/core";


@Injectable({
providedIn: 'root'
})
export class UtilService {

    constructor() { }

    convertDateToString(inputDate:Date): string {

        let date = new Date(inputDate);
        return date.getUTCFullYear() + "-" + (date.getUTCMonth()+1) + "-" + 
               date.getUTCDate() + " " + date.getUTCHours() + ":" + 
               date.getUTCMinutes() + ":" + date.getUTCSeconds();
    }
}