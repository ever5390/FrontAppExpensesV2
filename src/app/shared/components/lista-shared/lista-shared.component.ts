import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DataStructureListShared } from 'app/data/models/data.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { CONSTANTES } from 'app/data/constantes';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SLoaderService } from '../loaders/s-loader/service/s-loader.service';

@Component({
  selector: 'app-lista-shared',
  templateUrl: './lista-shared.component.html',
  styleUrls: ['./lista-shared.component.css']
})
export class ListaSharedComponent implements OnInit {

  //search = new FormControl('');

  subject = new Subject();

  txtSearch: string = '';
  listaShared : any[] = [];
  hiddenButtonAddItemAccording: boolean = true;
  show_checkbox: boolean = false;
  structureFormSend: DataStructureFormShared = new DataStructureFormShared();
  dataStructureList: DataStructureListShared = new DataStructureListShared();

  @Input() dataStructureListReceived: DataStructureListShared = new DataStructureListShared();
  @Output() emitResponseToForm = new EventEmitter<any>();

  //resize reziseWindowList
  @ViewChild('idList') idList: ElementRef | any;
  @ViewChild('idFormShared') idFormShared: ElementRef | any;

  constructor(
    private _renderer: Renderer2,
    private _loadSpinnerService: SLoaderService
  ) {
  }

  ngAfterViewInit() {
    this.reziseWindowList();
  }

  hiddenPopUp() {
    this.emitResponseToForm.emit(false);
  }

  ngOnInit() {

    this.hiddenButtonAddItemIfFromAccording();
    this.dataStructureList = this.dataStructureListReceived;
    this.listaShared = this.dataStructureList.lista;
    this.searchActivateFunction();
    
  }

  searchActivateFunction() {
    //Deprecated in v.6 , deleting in futures versions
    // this.search.valueChanges.pipe(
    //   debounceTime(200) // Cuando pare de escribir pasen 300 ms recíen enviará .
    // ).subscribe((value:string) => {
    //       this.listaShared = this.dataStructureListReceived.lista.filter(item => {
    //         return item.name.toUpperCase().includes(value.toUpperCase()) 
    //       }
    //       );                    
    //   }
    // )
      this.subject.pipe(
        debounceTime(100)
      ).subscribe((searchText:any) => {
        this.listaShared = this.dataStructureListReceived.lista.filter(item => {
          return item.name.toUpperCase().includes(searchText.toUpperCase()) 
            }
          );                    
        }
      )
  }

  searchMethod(evt:any) {
    const searchText = evt.target.value;
    this.subject.next(searchText)
  }

  hiddenButtonAddItemIfFromAccording() {
    if(this.dataStructureListReceived.component == CONSTANTES.CONST_COMPONENT_ACUERDOS) {
      this.hiddenButtonAddItemAccording = false;
    }
  }

  redirectToFormulario(objectSelected: any) {
    this._loadSpinnerService.showSpinner();
    this.structureFormSend = new DataStructureFormShared();
    this.structureFormSend.component = this.dataStructureListReceived.component;
    this.structureFormSend.title = this.dataStructureListReceived.title;
    this.structureFormSend.titleDos = this.dataStructureListReceived.titleDos;
    //Objeto inicializado - viene de cada componente
    this.structureFormSend.object = this.dataStructureList.objectOfLista;

    if(objectSelected === CONSTANTES.CONST_TEXT_VACIO) {
      this.structureFormSend.object.name=this.txtSearch;
      this.structureFormSend.action=CONSTANTES.CONST_TEXT_BTN_REGISTRAR;
    } else {
      this.structureFormSend.action=CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
      this.structureFormSend.imagen = objectSelected.image;
      this.structureFormSend.object=objectSelected;
    }

    this.emitResponseToForm.emit(this.structureFormSend);
  }

  reziseWindowList() {
    let windowHeight = window.innerHeight;
    setTimeout(()=> {
      let heightForm = this.idFormShared.nativeElement.clientHeight;

      let compare = (this.dataStructureListReceived.onlyListItems===false?windowHeight*0.5:windowHeight-20);
      if(heightForm > compare){
        this._renderer.setStyle(this.idList.nativeElement,"height",(windowHeight*0.55)+"px");
        this._renderer.setStyle(this.idList.nativeElement,"overflow-y","scroll");
      }
    },10);
  }

}
