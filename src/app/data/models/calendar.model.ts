import { ICalendar } from "../interfaces/calendar.interfaz";

export class Calendar implements ICalendar {
    constructor(
        public itemHTML: string = '',
        public dateSelected: Date = new Date()
    ){}
    
}