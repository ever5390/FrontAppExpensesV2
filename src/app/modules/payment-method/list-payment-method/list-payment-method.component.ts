import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeriodModel } from '@data/models/business/period.model';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
import { IDataSendItemToExpenseManager } from 'app/data/interfaces/data-send-item-to-expensemanager.interface';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { PaymentMethodModel } from 'app/data/models/business/payment-method.model';
import { DataStructureListShared } from 'app/data/models/data.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { PaymentMethodService } from 'app/data/services/payment-method/payment-method.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-list-payment-method',
  templateUrl: './list-payment-method.component.html',
  styleUrls: ['./list-payment-method.component.css']
})
export class ListPaymentMethodComponent implements OnInit {

  dataSendToExpenseManager: IDataSendItemToExpenseManager = {
    component:'',
    itemSelected: null
  };
  owner : OwnerModel = new OwnerModel();
  period: PeriodModel = new PeriodModel();
  listaPaymentMethod: PaymentMethodModel[] = [];
  flagFormulario: boolean = false;
  flagListShared: boolean = false;

  //Object send to List initializer
  dataStructureToListShared: DataStructureListShared = {
    component:CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO,
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_MEDIOSDEPAGO, 
    imagen:CONSTANTES.CONST_IMAGEN_MEDIOSDEPAGO,
    objectOfLista: new PaymentMethodModel(),
    lista: []
  };
  
  //Send To FormShared
  dataStructureToForm: DataStructureFormShared = new DataStructureFormShared();

  //object received to save or update
  paymentMethodReceivedToForm: PaymentMethodModel = new PaymentMethodModel();

  //Receive from ExpenseManager: order selected item
  @Input() receivedOrderSelectedItem: boolean = false;
  //Send to ExpenseManager: item selected
  @Output() sendItemSelectedToFormExpense = new EventEmitter();

  constructor(
    private _paymentMethodService: PaymentMethodService,
    private _loadSpinnerService: SLoaderService
  ) { 
  
  }

  ngOnInit(): void {
    this._loadSpinnerService.showSpinner();
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.getAllPaymentMethod();
  }
  
  getAllPaymentMethod() {
    this.flagListShared = false;
    this._paymentMethodService.getAllPaymentMethod(this.owner.id).subscribe(
      response => {
        this.listaPaymentMethod = response;
        this.flagListShared = true;
        this.dataStructureToListShared.lista = this.listaPaymentMethod;
        this._loadSpinnerService.hideSpinner();
      },
      error => {
        console.log(error);
        Swal.fire(
          'Error!',
          error.error.message,
          'error'
        )
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
      this.dataSendToExpenseManager.component=CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO;
      this.dataSendToExpenseManager.itemSelected=objectFromListToForm.object;
      this.sendItemSelectedToFormExpense.emit(this.dataSendToExpenseManager);
      return;
    }
    // END :: IF FROM EXPENSES_MANAGER 

    this.dataStructureToForm = objectFromListToForm;
    this.flagFormulario = true;
  }

  receiveFromFormShared(objectFromLFormToTransaction:any) {
    this.flagFormulario = false;
    if(objectFromLFormToTransaction === null) return;

    this.paymentMethodReceivedToForm.id = objectFromLFormToTransaction.object.id;
    this.paymentMethodReceivedToForm.image = objectFromLFormToTransaction.object.image;
    this.paymentMethodReceivedToForm.name = objectFromLFormToTransaction.object.name;
    this.paymentMethodReceivedToForm.owner = this.owner;

    if(objectFromLFormToTransaction.action == "delete") {
      this.delete(objectFromLFormToTransaction.object);
    } else {
      if(this.paymentMethodReceivedToForm.id == 0) {
        this.createNewElement(this.paymentMethodReceivedToForm);
      } else {
        this.updateElement(this.paymentMethodReceivedToForm);
      }
    }

  }
  
  delete(element: PaymentMethodModel) {
    this._paymentMethodService.delete(this.period.id, element.id).subscribe(
      response => {
        Swal.fire(
          response.title,
          response.message,
          response.status
        )
        this.getAllPaymentMethod();
      },
      error => {
        console.log(error);
        Swal.fire(
          error.error.title,
          error.error.message,
          error.error.status
        )
        this.getAllPaymentMethod();
      }
    );
  }


  updateElement(element: PaymentMethodModel) {
    this._paymentMethodService.update(element, element.id).subscribe(
      response => {
        Swal.fire(
          response.title,
          response.message,
          response.status
        )
        this.getAllPaymentMethod();

      },
      error => {
        console.log(error);
        Swal.fire(
          error.error.title,
          error.error.message,
          error.error.status
        )
        this.getAllPaymentMethod();
      }
    );
  }

  createNewElement(element: PaymentMethodModel) {
    this._paymentMethodService.create(element).subscribe(
      response => {
        Swal.fire(
          response.title,
          response.message,
          response.status
        )
        this.getAllPaymentMethod();

      },
      error => {
        console.log(error);
        Swal.fire(
          error.error.title,
          error.error.message,
          error.error.status
        )
        this.getAllPaymentMethod();
      }
    );
  }


}
