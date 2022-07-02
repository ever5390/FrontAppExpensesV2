import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  lista_categories: string[] = ['1','2','3','4','5','6']

  constructor() { }

  ngOnInit(): void {
    console.log(this.lista_categories);
  }

}
