import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailPeriodComponent } from "./detail-period/detail-period.component";
import { ListPeriodComponent } from "./list-period/list-period.component";

const routes: Routes = [
    {
        path:'',
        component: ListPeriodComponent
    },
    {
        path:'period-detail/:idPeriod',
        component: DetailPeriodComponent
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class PeriodRoutingModule {}

