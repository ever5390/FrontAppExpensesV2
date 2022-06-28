import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideComponent } from './aside/aside.component';
import { HeaderComponent } from './header/header.component';
import { SkeletonComponent } from './skeleton/skeleton.component';



@NgModule({
  declarations: [
    AsideComponent,
    HeaderComponent,
    SkeletonComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LayoutModule { }
