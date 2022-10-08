import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeriodModel } from '@data/models/business/period.model';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
import { IDataSendItemToExpenseManager } from 'app/data/interfaces/data-send-item-to-expensemanager.interface';
import { CategoryModel } from 'app/data/models/business/category.model';
import { GroupModel } from 'app/data/models/business/group.model';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { DataStructureListShared } from 'app/data/models/data.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { CategoryService } from 'app/data/services/category/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  dataSendToExpenseManager: IDataSendItemToExpenseManager = {
    component:'',
    itemSelected: null
  };
  owner : OwnerModel = new OwnerModel();
  period: PeriodModel = new PeriodModel();
  listaCategories: CategoryModel[] = [];
  flagFormulario: boolean = false;
  flagListShared: boolean = false;

  //Send to List Sahred
  dataStructureToListShared: DataStructureListShared = {
    component:CONSTANTES.CONST_COMPONENT_CATEGORIAS, 
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_CATEGORIAS,
    imagen:CONSTANTES.CONST_IMAGEN_CATEGORIAS,
    lista:[],
    objectOfLista: new CategoryModel()};

  //Send To FormShared
  dataStructureToForm: DataStructureFormShared = new DataStructureFormShared();

  //object received to save or update
  categoryReceivedToForm: CategoryModel =  new CategoryModel();

  //Receive from ExpenseManager: order selected item
  @Input() receivedOrderSelectedItem: boolean = false;
  //Send to ExpenseManager: item selected
  @Output() sendItemSelectedToFormExpense = new EventEmitter();

  constructor(
    private _categoryService: CategoryService,
    private _loadSpinnerService: SLoaderService
  ) { }

  ngOnInit(): void {
    this._loadSpinnerService.showSpinner();
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
    this.period = JSON.parse(localStorage.getItem("lcstrg_periodo")!);
    this.getAllCategories();
    
  }

  getAllGroups(objectFromListToForm:any) {
    this._categoryService.getAllGroups().subscribe(
      response => {
        this.seterDataStructureTosendForm(objectFromListToForm, response);
      },
      error => {
        console.log(error);
      }
    );
  }

  seterDataStructureTosendForm(objectFromListToForm: any, response: GroupModel[]) {
    this.dataStructureToForm = objectFromListToForm;
    this.dataStructureToForm.listGroupOnlyCategory = response;
    this.flagFormulario = true;
  }

  getAllCategories() {
    this.flagListShared = false;

    this._categoryService.getAllCategories(this.owner.id).subscribe(
      response => {
        this.listaCategories = response;
        this.flagListShared = true;
        this.dataStructureToListShared.lista = this.listaCategories;
        this._loadSpinnerService.hideSpinner();
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
      this.dataSendToExpenseManager.component=CONSTANTES.CONST_COMPONENT_CATEGORIAS;
      this.dataSendToExpenseManager.itemSelected=objectFromListToForm.object;
      this.sendItemSelectedToFormExpense.emit(this.dataSendToExpenseManager);
      return;
    }
    // END :: IF FROM EXPENSES_MANAGER 
    this.getAllGroups(objectFromListToForm);
  }

  receiveFromFormShared(objectFromLFormToTransaction: any) {
    this.flagFormulario = false;
    if(objectFromLFormToTransaction === null) return;

    this.categoryReceivedToForm.id = objectFromLFormToTransaction.object.id;
    this.categoryReceivedToForm.name = objectFromLFormToTransaction.object.name;
    this.categoryReceivedToForm.image = objectFromLFormToTransaction.object.image;
    this.categoryReceivedToForm.group = objectFromLFormToTransaction.object.group;
    this.categoryReceivedToForm.owner = this.owner;

    if(objectFromLFormToTransaction.action == "delete") {
        this.delete(this.categoryReceivedToForm);
    } else {
      if(this.categoryReceivedToForm.id == 0) {
        this.createNewElement(this.categoryReceivedToForm);
      } else {
        this.updateElement(this.categoryReceivedToForm);
      };
    }
 
  }

  delete(element: any) {
    this._categoryService.delete(this.period.id, element.id).subscribe(
      response => {
        Swal.fire(
          response.title,
          response.message,
          response.status
        )
        this.getAllCategories();
      },
      error => {
        console.log(error);
        Swal.fire(
          error.error.title,
          error.error.message,
          error.error.status
        )
        this.getAllCategories();
      }
    );
  }

  updateElement(element: CategoryModel) {
    this._categoryService.update(element, element.id).subscribe(
      response => {
        Swal.fire(
          response.title,
          response.message,
          response.status
        )
        this.getAllCategories();

      },
      error => {
        console.log(error);
        Swal.fire(
          error.error.title,
          error.error.message,
          error.error.status
        )
        this.getAllCategories();
      }
    );
  }

  createNewElement(element: CategoryModel) {
    this._categoryService.create(element).subscribe(
      response => {
        Swal.fire(
          response.title,
          response.message,
          response.status
        )
        this.getAllCategories();

      },
      error => {
        console.log(error);
        Swal.fire(
          error.error.title,
          error.error.message,
          error.error.status
        )
        this.getAllCategories();
      }
    );
  }

}
