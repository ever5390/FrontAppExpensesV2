import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from 'app/data/constantes';
import { DataStructure } from 'app/data/models/data.model';

@Component({
  selector: 'app-list-according',
  templateUrl: './list-according.component.html',
  styleUrls: ['./list-according.component.css']
})
export class ListAccordingComponent implements OnInit {

  dataStructure: DataStructure = {
    item:CONSTANTES.CONST_ACUERDOS,
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_ACUERDOS, 
    imagen:CONSTANTES.CONST_IMAGEN_ACUERDOS};

  constructor() { }

  ngOnInit(): void {
  }

}
