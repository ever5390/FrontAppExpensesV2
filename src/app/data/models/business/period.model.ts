import { Workspace } from "./workspace.model";

export class PeriodModel {
    constructor(
        public activate:     boolean = false,
        public finalDate:    string = "",
        public id:           number = 0,
        public startDate:    string = "",
        public statusPeriod: boolean = false,
        public workSpace:    Workspace = new Workspace()
    ){}
}