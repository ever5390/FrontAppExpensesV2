import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SkeletonComponent } from "@layout/skeleton/skeleton.component";
import { UserComponent } from "./user-login-register/user.component";

const routes: Routes = [
    {
        path:'',
        component: SkeletonComponent
    },
    {
        path:'sign-up',
        component: UserComponent
    }
    
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class UserRoutingModule {}