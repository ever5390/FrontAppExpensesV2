  import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
  import { PaymentMethodModel } from '@data/models/business/payment-method.model';
  import { PaymentMethodService } from '@data/services/payment-method/payment-method.service';
  import { StorageService } from '@data/services/storage_services/storage.service';
  import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
  import { StructureFormSharedModel } from '@shared/interfaces/shared-structure-fom.model';
  import { CONSTANTES } from 'app/data/constantes';
  import { IDataSendItemToExpenseManager } from 'app/data/interfaces/data-send-item-to-expensemanager.interface';
  import { OwnerModel } from 'app/data/models/business/owner.model';
  import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { Console } from 'console';
  import Swal from 'sweetalert2';
  
  @Component({
    selector: 'app-list-payment-method',
    templateUrl: './list-payment-method.component.html',
    styleUrls: ['./list-payment-method.component.css']
  })
  export class ListPaymentMethodComponent implements OnInit {
  
    imagenDefault: string = CONSTANTES.CONST_IMAGEN_CATEGORIAS;
    owner : OwnerModel = new OwnerModel();
    paymentMehtodEmpty: PaymentMethodModel = new PaymentMethodModel();
    paymentMethodUseToUse: PaymentMethodModel = new PaymentMethodModel();
    listaPaymentMethods: PaymentMethodModel[] = [];
    listaPaymentsSendSearch: PaymentMethodModel[] = [];
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
    @Input() heightShared: number = 0;
    //Send to ExpenseManager: item selected
    @Output() sendItemSelectedToFormExpense = new EventEmitter();
    @ViewChild('container_all') containerAll: ElementRef | any;
    @ViewChild('container_block') containerBlock: ElementRef | any;
    @ViewChild('container_block_items') containerBlockItems: ElementRef | any;
  
    constructor(
      private _paymentMethodService: PaymentMethodService,
      private _loadSpinnerService: SLoaderService,
      private _storageService :StorageService,
      private _renderer: Renderer2
    ) {
      this.owner = JSON.parse(localStorage.getItem("lcstrg_owner")!);
     }
  
    ngOnInit(): void {
      this._loadSpinnerService.showSpinner();
      this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
      this.getAllPaymentMethod("");
    }

    ngAfterViewInit() {
      setTimeout(() => {
        // this.validateResizeHeightForm();
      }, 500);
    }

    onImageLoad() {
      //this.validateResizeHeightForm();
      // Do what you need in here
      setTimeout(() => {
        this.loadImageFull = true;
        
      }, 200)
    }

    sendHeightFormRegister: number = 0;
    heigthContainerAll: number = 0;
    heigthContainerBlock: number = 0;
    heigthContainerBlockItems: number = 0;
    private validateResizeHeightForm() {
      let windowHeight = window.innerHeight;
      this.heigthContainerAll = this.containerAll.nativeElement.clientHeight;
      this.heigthContainerBlock = this.containerBlock.nativeElement.clientHeight;
      this.heigthContainerBlockItems = this.containerBlockItems.nativeElement.clientHeight;
      // console.log(this.heigthContainerAll);
      // console.log(this.heigthContainerBlock);
      // console.log(this.heigthContainerBlockItems);
      this._renderer.setStyle(this.containerAll.nativeElement, "height",  (windowHeight - 42) + "px");
      if(this.receivedOrderSelectedItem)
        this._renderer.setStyle(this.containerAll.nativeElement, "height", (this.heightShared) + "px");
      
      let newHeigthContainerAll = this.containerAll.nativeElement.clientHeight;
      if(this.heigthContainerBlock > newHeigthContainerAll)
        this._renderer.setStyle(this.containerBlock.nativeElement, "height", (newHeigthContainerAll*0.9) + "px");
      
      let newHeigthContainerBlock = this.containerBlock.nativeElement.clientHeight;
      this._renderer.setStyle(this.containerBlock.nativeElement, "overflow-y", "hidden");
      this._renderer.setStyle(this.containerBlockItems.nativeElement, "height", (newHeigthContainerBlock - 150) + "px");
      this._renderer.setStyle(this.containerBlockItems.nativeElement, "overflow-y", "scroll");
    }
  
    showRegisterForm(paymentMethodSelected : PaymentMethodModel) {
      if(this.receivedOrderSelectedItem == true && paymentMethodSelected.id != 0) {
        this.sendItemSelectedToFormExpense.emit({component: CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO, itemSelected: paymentMethodSelected});
      }

      this.flagFormulario = true;
      this.dataSendFormRegister.component = CONSTANTES.CONST_COMPONENT_CATEGORIAS;
      this.dataSendFormRegister.object = paymentMethodSelected;
      this.dataSendFormRegister.txtActionBtn = paymentMethodSelected.id == 0?CONSTANTES.CONST_TEXT_BTN_REGISTRAR:CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
      this.dataSendFormRegister.listaShow = false;
    }

    receivedDataFromSearch(data : any) {
      this.loadImageFull = false;
      this.listaPaymentMethods = data;
      setTimeout(() => {
        this.loadImageFull = true;
      }, 200)
    }
  
    getAllPaymentMethod(responseOut : any) {
      this._paymentMethodService.getAllPaymentMethod(this.owner.id).subscribe(
        response => {
          this.listaPaymentsSendSearch = response; //Search Send
          this.listaPaymentMethods = response;
          this._loadSpinnerService.hideSpinner();
          setTimeout(() => {
            this.validateResizeHeightForm();
          }, 500)
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
  
    receiveFromFormShared(responseFormShared: any) {
      if(responseFormShared == null) {
        this.flagFormulario = false;
        return;
      };
      console.log(responseFormShared);
      this.paymentMethodUseToUse = responseFormShared.structureData.object;
  
      //Delete
      if(responseFormShared.orden == 0) {
        this.confirmPreDelete();
        return;
      }
  
      //Validation
      if(this.validationForm() == false) {
        this._loadSpinnerService.hideSlow();
        return;
      }
  
      if(responseFormShared.structureData.imgDefault != null) {
        this.uploadImageToFirestore(responseFormShared.structureData.imgDefault);
        return;
      }
  
      console.log(this.paymentMethodUseToUse);
      this.processSaveOrUpdate();
    }
  
    processSaveOrUpdate() {
      //Update
      if(this.paymentMethodUseToUse.id != 0) {
        this.updateElement(this.paymentMethodUseToUse);
        return;
      }
  
      //Save
      this.paymentMethodUseToUse.owner = this.owner;
      this.createNewElement(this.paymentMethodUseToUse);
    }
  
    validationForm():boolean {
  
      if(this.paymentMethodUseToUse.name == CONSTANTES.CONST_TEXT_VACIO) {
          Swal.fire("Alerta","El campo nombre se encuentra vacío","info");
          return false;
      }
  
      return true;
    }
  
    uploadImageToFirestore(imageToUpload : File) {
      console.log(imageToUpload);
      let reader = new FileReader();
      reader.readAsDataURL(imageToUpload!);
      reader.onloadend = ()=> {
        this._storageService.uploadImage(imageToUpload!.name + "_" + Date.now(), reader.result, 
                                      this.owner.username + "/" + CONSTANTES.CONST_COMPONENT_MEDIOSDEPAGO)
          .then(
          urlImagen => {
            console.log(urlImagen);
            this.paymentMethodUseToUse.image = urlImagen!;
            this.processSaveOrUpdate();
          }, () => {
            Swal.fire("","Imagen no procesada correctamente","info");
            this.processSaveOrUpdate();
          }
        );
      }
    }
  
    confirmPreDelete() {
      Swal.fire({
        title: 'Estás seguro?',
        text: "Este proceso no podrá revertirse!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar de todas formas!'
      }).then((result) => {
        if (result.isConfirmed) {
          this._loadSpinnerService.showSpinner();
          this.delete(this.paymentMethodUseToUse);
        }
      })
    }
  
    delete(element: PaymentMethodModel) {
      this._paymentMethodService.delete(element.id).subscribe(
        response => {
          this.getAllPaymentMethod(response);
        },
        error => {
          this.messageError(error.error);
          this.flagFormulario = false;
        }
      );
    }
  
    updateElement(element: PaymentMethodModel) {
      this._loadSpinnerService.showSpinner();
      this._paymentMethodService.update(element, element.id).subscribe(
        response => {
          this.getAllPaymentMethod(response);
        },
        error => {
          this.messageError(error.error);
        }
      );
    }
  
    createNewElement(element: PaymentMethodModel) {
      this._loadSpinnerService.showSpinner();
      this._paymentMethodService.create(element).subscribe(
        response => {
          this.getAllPaymentMethod(response);
        },
        error => {
          this.messageError(error.error);
        }
      );
    }
  
    messageError(error: any) {
      Swal.fire(error.title, error.message, error.status)
      this._loadSpinnerService.hideSpinner();
    }
  
  }
  