import { Component, OnInit } from '@angular/core';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
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

  owner : OwnerModel = new OwnerModel();
  listaPaymentMethod: PaymentMethodModel[] = [];
  flagFormulario: boolean = false;

  //Object send to List initializer
  dataStructureToListShared: DataStructureListShared = {
    component:CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO,
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_MEDIOSDEPAGO, 
    imagen:CONSTANTES.CONST_IMAGEN_MEDIOSDEPAGO,
    objectOfLista: new PaymentMethodModel()
  };
    
  //Send To FormShared
  dataStructureToForm: DataStructureFormShared = new DataStructureFormShared();

  //object received to save or update
  paymentMethodReceivedToForm: PaymentMethodModel = new PaymentMethodModel();

  constructor(
    private _paymentMethodService: PaymentMethodService,
    private _loadSpinnerService: SLoaderService
  ) { 
  
  }

  ngOnInit(): void {
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.getAllPaymentMethod();
  }
  
  getAllPaymentMethod() {
    this._paymentMethodService.getAllPaymentMethod().subscribe(
      response => {
        this.listaPaymentMethod = response;
        this.dataStructureToListShared.lista = this.listaPaymentMethod;
        this._loadSpinnerService.hideSpinner();
        // this.dataStructureToListShared.objectOfLista = new PaymentMethodModel();
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
    console.log("PAYMENT ::: RECEIVE OF LIST SHARED");
    this.dataStructureToForm = objectFromListToForm;
    this.flagFormulario = true;
  }

  receiveFromFormShared(objectFromLFormToTransaction:any) {
    console.log("PAYMENT ::: RECEIVE OF FORM SHARED");
    console.log(objectFromLFormToTransaction);
    this.flagFormulario = false;
    if(objectFromLFormToTransaction === null) return;

    this.paymentMethodReceivedToForm.id = objectFromLFormToTransaction.id;
    this.paymentMethodReceivedToForm.image = objectFromLFormToTransaction.image;
    this.paymentMethodReceivedToForm.name = objectFromLFormToTransaction.name;
    this.paymentMethodReceivedToForm.owner = this.owner;

    console.log(this.paymentMethodReceivedToForm);
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
  
  delete(element: any) {
    this._paymentMethodService.delete(element.id).subscribe(
      response => {
        Swal.fire(
          "Exito",
          "El objeto " + element.name + " se eliminó con éxito",
          "success"
        )
        this.getAllPaymentMethod();

      },
      error => {
        console.log(error);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar elimnar, inténtelo nuevamente",
          "error"
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
