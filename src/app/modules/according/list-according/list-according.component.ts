  import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccordingModel } from '@data/models/business/according.model';
import { AccordingService } from '@data/services/according/according.service';
  import { StorageService } from '@data/services/storage_services/storage.service';
  import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
  import { StructureFormSharedModel } from '@shared/interfaces/shared-structure-fom.model';
  import { CONSTANTES } from 'app/data/constantes';
  import { IDataSendItemToExpenseManager } from 'app/data/interfaces/data-send-item-to-expensemanager.interface';
  import { OwnerModel } from 'app/data/models/business/owner.model';
  import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
  import Swal from 'sweetalert2';
  
  @Component({
    selector: 'app-list-according',
    templateUrl: './list-according.component.html',
    styleUrls: ['./list-according.component.css']
  })
  export class ListAccordingComponent implements OnInit {
  
    imagenDefault: string = CONSTANTES.CONST_IMAGEN_CATEGORIAS;
    owner : OwnerModel = new OwnerModel();
    paymentMehtodEmpty: AccordingModel = new AccordingModel();
    paymentMethodUseToUse: AccordingModel = new AccordingModel();
    listAccording: AccordingModel[] = [];
    listaAccordingSendSearch: AccordingModel[] = [];
    loadImageFull: boolean = false;
    flagFormulario: boolean = false;
    dataSendFormRegister: StructureFormSharedModel = new StructureFormSharedModel();
  
  //Call Expenses componente register
    dataSendToExpenseManager: IDataSendItemToExpenseManager = {
      component:'',
      itemSelected: null
    };
    //Receive from ExpenseManager: order selected item
    @Input() receivedOrderSelectedItem: boolean = false;
    //Send to ExpenseManager: item selected
    @Output() sendItemSelectedToFormExpense = new EventEmitter();
  
  
    //QUITAR!!
    dataStructureToForm: DataStructureFormShared = new DataStructureFormShared();
  
    constructor(
      private _accordingService: AccordingService,
      private _loadSpinnerService: SLoaderService,
      private _storageService :StorageService
    ) {
      this.owner = JSON.parse(localStorage.getItem("lcstrg_owner")!);
     }
  
    ngOnInit(): void {
      this._loadSpinnerService.showSpinner();
      this.getAllAccording("");
    }
  
    onImageLoad() {
      // Do what you need in here
      setTimeout(() => {
        this.loadImageFull = true;
      }, 200)
    }
  
    showRegisterForm(accordingSelected : AccordingModel) {
      if(this.receivedOrderSelectedItem == true) {
        this.sendItemSelectedToFormExpense.emit({component: CONSTANTES.CONST_COMPONENT_ACUERDOS, itemSelected: accordingSelected});
      }
      this.flagFormulario = true;
      this.dataSendFormRegister.component = CONSTANTES.CONST_COMPONENT_CATEGORIAS;
      this.dataSendFormRegister.object = accordingSelected;
      this.dataSendFormRegister.txtActionBtn = accordingSelected.id == 0?CONSTANTES.CONST_TEXT_BTN_REGISTRAR:CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
      this.dataSendFormRegister.listaShow = false;
    }

    receivedDataFromSearch(data : any) {
      this.loadImageFull = false;
      this.listAccording = data;
      setTimeout(() => {
        this.loadImageFull = true;
      }, 200);
    }
  
    getAllAccording(responseOut : any) {
      this._accordingService.getAllAccording().subscribe(
        response => {
          this.listaAccordingSendSearch = response;
          this.listAccording = response;
          this._loadSpinnerService.hideSpinner();
          this.flagFormulario = false;
          if(responseOut == "") return;
          Swal.fire(
            responseOut.title,
            responseOut.message,
            responseOut.status
          )
        },
        error => {
          Swal.fire("Error","Se produjo un error al ejecutar la solicitud, recargue la aplicación e intente nuevamente","error")
          this._loadSpinnerService.hideSlow();
          this.flagFormulario = false;
        }
      );
    }
  
  //   receiveFromFormShared(responseFormShared: any) {
  //     if(responseFormShared == null) {
  //       this.flagFormulario = false;
  //       return;
  //     };
  //     console.log(responseFormShared);
  //     this.paymentMethodUseToUse = responseFormShared.structureData.object;
  
  //     //Delete
  //     if(responseFormShared.orden == 0) {
  //       this.confirmPreDelete();
  //       return;
  //     }
  
  //     //Validation
  //     if(this.validationForm() == false) {
  //       this._loadSpinnerService.hideSlow();
  //       return;
  //     }
  
  //     if(responseFormShared.structureData.imgDefault != null) {
  //       this.uploadImageToFirestore(responseFormShared.structureData.imgDefault);
  //       return;
  //     }
  
  //     console.log(this.paymentMethodUseToUse);
  //     this.processSaveOrUpdate();
  //   }
  
  //   processSaveOrUpdate() {
  //     //Update
  //     if(this.paymentMethodUseToUse.id != 0) {
  //       this.updateElement(this.paymentMethodUseToUse);
  //       return;
  //     }
  
  //     //Save
  //     this.paymentMethodUseToUse.owner = this.owner;
  //     this.createNewElement(this.paymentMethodUseToUse);
  //   }
  
  //   validationForm():boolean {
  
  //     if(this.paymentMethodUseToUse.name == CONSTANTES.CONST_TEXT_VACIO) {
  //         Swal.fire("Alerta","El campo nombre se encuentra vacío","info");
  //         return false;
  //     }
  
  //     return true;
  //   }
  
  //   uploadImageToFirestore(imageToUpload : File) {
  //     console.log(imageToUpload);
  //     let reader = new FileReader();
  //     reader.readAsDataURL(imageToUpload!);
  //     reader.onloadend = ()=> {
  //       this._storageService.uploadImage(imageToUpload!.name + "_" + Date.now(), reader.result, 
  //                                     this.owner.username + "/" + CONSTANTES.CONST_COMPONENT_CATEGORIAS)
  //         .then(
  //         urlImagen => {
  //           console.log(urlImagen);
  //           this.paymentMethodUseToUse.image = urlImagen!;
  //           this.processSaveOrUpdate();
  //         }, () => {
  //           Swal.fire("","Imagen no procesada correctamente","info");
  //           this.processSaveOrUpdate();
  //         }
  //       );
  //     }
  //   }
  
  //   confirmPreDelete() {
  //     Swal.fire({
  //       title: 'Estás seguro?',
  //       text: "Este proceso no podrá revertirse!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Si, eliminar de todas formas!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this._loadSpinnerService.showSpinner();
  //         this.delete(this.paymentMethodUseToUse);
  //       }
  //     })
  //   }
  
  //   delete(element: AccordingModel) {
  //     this._accordingService.delete(element.id).subscribe(
  //       response => {
  //         this.getAllAccording(response);
  //       },
  //       error => {
  //         this.messageError(error.error);
  //         this.flagFormulario = false;
  //       }
  //     );
  //   }
  
  //   updateElement(element: AccordingModel) {
  //     this._loadSpinnerService.showSpinner();
  //     this._accordingService.update(element, element.id).subscribe(
  //       response => {
  //         this.getAllAccording(response);
  //       },
  //       error => {
  //         this.messageError(error.error);
  //       }
  //     );
  //   }
  
  //   createNewElement(element: AccordingModel) {
  //     this._loadSpinnerService.showSpinner();
  //     this._accordingService.create(element).subscribe(
  //       response => {
  //         this.getAllAccording(response);
  //       },
  //       error => {
  //         this.messageError(error.error);
  //       }
  //     );
  //   }
  
  //   messageError(error: any) {
  //     Swal.fire(error.title, error.message, error.status)
  //     this._loadSpinnerService.hideSpinner();
  //   }
  
}
  