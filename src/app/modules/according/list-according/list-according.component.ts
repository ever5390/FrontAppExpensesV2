import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from 'app/data/constantes';
import { AccordingModel } from 'app/data/models/business/according.model';
import { DataStructureListShared } from 'app/data/models/data.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
//import { IDataStructureLisShared } from 'app/data/models/data.model';
import { AccordingService } from 'app/data/services/according/according.service';

@Component({
  selector: 'app-list-according',
  templateUrl: './list-according.component.html',
  styleUrls: ['./list-according.component.css']
})
export class ListAccordingComponent implements OnInit {

  listaAccording: AccordingModel[] = [];

  //Send To FormShared
  dataStructureToForm: DataStructureFormShared = new DataStructureFormShared();

  //Send to List Sahred
  dataStructureToList: DataStructureListShared = {
    component:CONSTANTES.CONST_COMPONENT_ACUERDOS,
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_ACUERDOS, 
    imagen:CONSTANTES.CONST_IMAGEN_ACUERDOS
 };


 flagFormulario: boolean = false;
 sendBtnText: string = '';


  constructor(private _accordingService: AccordingService) { 
  }

  ngOnInit(): void {
    this.getAllAccording();
  }

  getAllAccording() {
    this._accordingService.getAllAccording().subscribe(
      response => {
        this.listaAccording = response;
        this.dataStructureToList.lista = this.listaAccording;
      },
      error => {
        console.log(error);
      }
    );
  }


  receiveDatFormFromListShared(e: any) {
    this.dataStructureToForm = e;
    this.flagFormulario = true;
  }


  receiveToSonComponent(e:any) {
    this.flagFormulario = false;
  }

}
