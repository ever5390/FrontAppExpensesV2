import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from 'app/data/constantes';
import { DataStructure } from 'app/data/models/data.model';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  lista_categories: string[] = ['1','2','3','4','5','6']

  dataStructure: DataStructure = {
    item:CONSTANTES.CONST_CATEGORIAS, 
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_CATEGORIAS, 
    imagen:CONSTANTES.CONST_IMAGEN_CATEGORIAS};

  constructor() { }

  ngOnInit(): void {
    console.log(this.lista_categories);
  }

}
