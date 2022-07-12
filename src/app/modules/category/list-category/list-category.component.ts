import { Component, OnInit } from '@angular/core';
import { SLoaderService } from '@shared/components/loaders/s-loader/service/s-loader.service';
import { CONSTANTES } from 'app/data/constantes';
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

  owner : OwnerModel = new OwnerModel();
  listaCategories: CategoryModel[] = [];
  flagFormulario: boolean = false;

  //Send to List Sahred
  dataStructureToListShared: DataStructureListShared = {
    component:CONSTANTES.CONST_COMPONENT_CATEGORIAS, 
    title:CONSTANTES.CONST_TITLE_CONFIGURACION_DE_CATEGORIAS,
    imagen:CONSTANTES.CONST_IMAGEN_CATEGORIAS,
    objectOfLista: new CategoryModel()};

  //Send To FormShared
  dataStructureToForm: DataStructureFormShared = new DataStructureFormShared();

  //object received to save or update
  categoryReceivedToForm: CategoryModel =  new CategoryModel();

  constructor(
    private _categoryService: CategoryService,
    private _loadSpinnerService: SLoaderService
  ) { }

  ngOnInit(): void {
    console.log("INICIO DE LISTA CATEGORÍA");
    this.owner = JSON.parse(localStorage.getItem('lcstrg_owner')!);
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
    this._categoryService.getAllCategories().subscribe(
      response => {
        this.listaCategories = response;
        this.dataStructureToListShared.lista = this.listaCategories;
        this._loadSpinnerService.hideSpinner();
      },
      error => {
        console.log(error);
      }
    );
  }
  
  receiveItemSelectedFromListShared(objectFromListToForm: any) {
    this.getAllGroups(objectFromListToForm);
  }

  receiveFromFormShared(objectFromLFormToTransaction: any) {
    console.log("CATEGORY ::: RECEIVE OF FORM SHARED");
    
    this.flagFormulario = false;
    if(objectFromLFormToTransaction === null) return;

    this.categoryReceivedToForm.id = objectFromLFormToTransaction.id;
    this.categoryReceivedToForm.name = objectFromLFormToTransaction.name;
    this.categoryReceivedToForm.image = objectFromLFormToTransaction.image;
    this.categoryReceivedToForm.group = objectFromLFormToTransaction.group;
    this.categoryReceivedToForm.owner = this.owner;

    if(objectFromLFormToTransaction.action == "delete") {
        this.delete(objectFromLFormToTransaction.object);
    } else {
      if(this.categoryReceivedToForm.id == 0) {
        this.createNewElement(this.categoryReceivedToForm);
      } else {
        this.updateElement(this.categoryReceivedToForm);
      };
    }
    

    console.log(this.categoryReceivedToForm);
  }

  delete(element: any) {
    this._categoryService.delete(element.id).subscribe(
      response => {
        Swal.fire(
          "Exito",
          "El objeto " + element.name + " se eliminó con éxito",
          "success"
        )
        this.getAllCategories();

      },
      error => {
        console.log(error);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar elimnar, inténtelo nuevamente",
          "error"
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
