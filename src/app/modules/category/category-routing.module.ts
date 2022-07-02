import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailCategoryComponent } from './detail-category/detail-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';

const routes: Routes = [
  {
    path:'category-list',
    component: ListCategoryComponent
  },
  {
    path:'category-detail',
    component: DetailCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
