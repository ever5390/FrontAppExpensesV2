import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from '@data/services/storage_services/storage.service';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { StructureFormSharedModel } from '@shared/interfaces/shared-structure-fom.model';
import { CONSTANTES } from 'app/data/constantes';
import { IDataSendItemToExpenseManager } from 'app/data/interfaces/data-send-item-to-expensemanager.interface';
import { CategoryModel } from 'app/data/models/business/category.model';
import { GroupModel } from 'app/data/models/business/group.model';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { CategoryService } from 'app/data/services/category/category.service';
import { Console } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  imagenDefault: string = CONSTANTES.CONST_IMAGEN_CATEGORIAS;
  owner : OwnerModel = new OwnerModel();
  categorEmpty: CategoryModel = new CategoryModel();
  categoryToUse: CategoryModel = new CategoryModel();
  listaCategories: CategoryModel[] = [];
  listaCategoriesSendSearch: CategoryModel[] = [];
  listaGroups : GroupModel[] =[];
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
    private _categoryService: CategoryService,
    private _loadSpinnerService: SLoaderService,
    private _storageService :StorageService,
    private _renderer: Renderer2,
  ) {
    this.owner = JSON.parse(localStorage.getItem("lcstrg_owner")!);
   }

  ngOnInit(): void {
    this._loadSpinnerService.showSpinner();
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.getAllGroups();
    this.getAllCategories("");
    
  }

  onImageLoad() {
    // Do what you need in here
    //this.validateResizeHeightForm();
    setTimeout(() => {
      this.loadImageFull = true;
    }, 200);
   
  }

  ngAfterViewInit() {
    setTimeout(() => {
      //this.validateResizeHeightForm();
    }, 100);
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

  showRegisterForm(categorySelected : CategoryModel) {

    if(this.receivedOrderSelectedItem == true && categorySelected.id != 0) {
      this.sendItemSelectedToFormExpense.emit({component: CONSTANTES.CONST_COMPONENT_CATEGORIAS, itemSelected: categorySelected});
    }

    this.flagFormulario = true;
    this.dataSendFormRegister.component = CONSTANTES.CONST_COMPONENT_CATEGORIAS;
    this.dataSendFormRegister.object = categorySelected;
    this.dataSendFormRegister.txtActionBtn = categorySelected.id == 0?CONSTANTES.CONST_TEXT_BTN_REGISTRAR:CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
    this.dataSendFormRegister.lista = this.listaGroups;
    this.dataSendFormRegister.listaShow = true;
  }

  receivedDataFromSearch(data : any) {
    this.loadImageFull = false;
    this.listaCategories = data;
    setTimeout(() => {
      this.loadImageFull = true;
    }, 200);
  }

  getAllCategories(responseOut : any) {
    this._categoryService.getAllCategories(this.owner.id).subscribe(
      response => {
        this.listaCategoriesSendSearch = response;
        this.listaCategories = response;
        this._loadSpinnerService.hideSpinner();
        this.flagFormulario = false;
        setTimeout(() => {
          this.validateResizeHeightForm();
        }, 500)
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

  getAllGroups() {
    this._categoryService.getAllGroups().subscribe(
      response => {
       this.listaGroups = response;
      },
      error => {
        Swal.fire(
          error.error.title,
          error.error.message,
          error.error.status
        )
      }
    );
  }

  receiveFromFormShared(responseFormShared: any) {
    if(responseFormShared == null) {
      this.flagFormulario = false;
      return;
    };
    console.log(responseFormShared);
    this.categoryToUse = responseFormShared.structureData.object;

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

    console.log(this.categoryToUse);
    this.processSaveOrUpdate();
  }

  processSaveOrUpdate() {
    //Update
    if(this.categoryToUse.id != 0) {
      this.updateElement(this.categoryToUse);
      return;
    }

    //Save
    this.categoryToUse.owner = this.owner;
    this.createNewElement(this.categoryToUse);
  }

  validationForm():boolean {

    if(this.categoryToUse.name == CONSTANTES.CONST_TEXT_VACIO) {
        Swal.fire("Alerta","El campo nombre se encuentra vacío","info");
        return false;
    }

    if(this.categoryToUse.group.id == 0) {
        Swal.fire("Alerta","Debe seleccionar un grupo para esta categoría","info");
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
                                    this.owner.username + "/" + CONSTANTES.CONST_COMPONENT_CATEGORIAS)
        .then(
        urlImagen => {
          console.log(urlImagen);
          this.categoryToUse.image = urlImagen!;
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
        this.delete(this.categoryToUse);
      }
    })
  }

  delete(element: CategoryModel) {
    this._categoryService.delete(element.id).subscribe(
      response => {
        this.getAllCategories(response);
      },
      error => {
        this.messageError(error.error);
        this.flagFormulario = false;
      }
    );
  }

  updateElement(element: CategoryModel) {
    this._loadSpinnerService.showSpinner();
    this._categoryService.update(element, element.id).subscribe(
      response => {
        this.getAllCategories(response);
      },
      error => {
        this.messageError(error.error);
      }
    );
  }

  createNewElement(element: CategoryModel) {
    this._loadSpinnerService.showSpinner();
    this._categoryService.create(element).subscribe(
      response => {
        this.getAllCategories(response);
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
