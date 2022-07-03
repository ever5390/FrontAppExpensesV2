import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from 'app/data/constantes';
import { DataStructure } from 'app/data/models/data.model';

@Component({
  selector: 'app-list-payment-method',
  templateUrl: './list-payment-method.component.html',
  styleUrls: ['./list-payment-method.component.css']
})
export class ListPaymentMethodComponent implements OnInit {

  dataStructure: DataStructure = {
    item:CONSTANTES.CONST_MEDIOSDEPAGO,
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_MEDIOSDEPAGO, 
    imagen:CONSTANTES.CONST_IMAGEN_MEDIOSDEPAGO};
    
  constructor() { }

  ngOnInit(): void {
  }

}
