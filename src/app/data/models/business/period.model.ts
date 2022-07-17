import { Workspace } from "./workspace.model";

export class PeriodModel {
    constructor(
        public activate:     boolean = false,
        public finalDate:    Date = new Date(),
        public id:           number = 0,
        public startDate:    Date = new Date(),
        public statusPeriod: boolean = false,
        public workSpace:    Workspace = new Workspace()
    ){}
}