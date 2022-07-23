import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTES } from 'app/data/constantes';
import { IDataSendItemToExpenseManager } from 'app/data/interfaces/data-send-item-to-expensemanager.interface';
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
  
  dataSendToExpenseManager: IDataSendItemToExpenseManager = {
    component:'',
    itemSelected: null
  };

  listaAccording: AccordingModel[] = [];

  //Send To FormShared
  dataStructureToForm: DataStructureFormShared = new DataStructureFormShared();

  //Send to List Sahred
  dataStructureToListShared: DataStructureListShared = {
    component:CONSTANTES.CONST_COMPONENT_ACUERDOS,
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_ACUERDOS, 
    imagen:CONSTANTES.CONST_IMAGEN_ACUERDOS,
    lista:[]
   };


 flagFormulario: boolean = false;
 sendBtnText: string = '';

  //Receive from ExpenseManager: order selected item
  @Input() receivedOrderSelectedItem: boolean = false;
  //Send to ExpenseManager: item selected
  @Output() sendItemSelectedToFormExpense = new EventEmitter();

  constructor(private _accordingService: AccordingService) { 
  }

  ngOnInit(): void {

    this.getAllAccording2();
  }

  getAllAccording2() {
    console.log("dererere");
    this._accordingService.getAllAccording().subscribe(
      response => {
        
        this.listaAccording = response;

        this.dataStructureToListShared.lista = this.listaAccording;
      },
      error => {
        console.log(error);
      }
    );
  }

  receiveItemSelectedFromListShared(objectFromListToForm: any) {


    if(objectFromListToForm == false) {
      this.sendItemSelectedToFormExpense.emit(false);
      return;
    }

    // BEGIN :: IF FROM EXPENSES_MANAGER
    if(this.receivedOrderSelectedItem == true && 
      objectFromListToForm.object.id != 0) {
      this.dataSendToExpenseManager.component=CONSTANTES.CONST_COMPONENT_ACUERDOS;
      this.dataSendToExpenseManager.itemSelected=objectFromListToForm.object;
      this.sendItemSelectedToFormExpense.emit(this.dataSendToExpenseManager);
      return;
    }
    // END :: IF FROM EXPENSES_MANAGER 

    this.dataStructureToForm = objectFromListToForm;
    this.flagFormulario = true;
  }

  receiveToSonComponent(e:any) {
    this.flagFormulario = false;
  }

}
