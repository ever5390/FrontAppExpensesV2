import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DataStructureListShared } from 'app/data/models/data.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { CONSTANTES } from 'app/data/constantes';

@Component({
  selector: 'app-lista-shared',
  templateUrl: './lista-shared.component.html',
  styleUrls: ['./lista-shared.component.css']
})
export class ListaSharedComponent implements OnInit {

  show_checkbox: boolean = false;
  structureFormSend: DataStructureFormShared = new DataStructureFormShared();
  dataStructureList: DataStructureListShared = new DataStructureListShared();

  @Input() dataStructureListReceived: DataStructureListShared = new DataStructureListShared();
  @Output() emitResponseToForm = new EventEmitter<any>();

  //resize reziseWindowList
  @ViewChild('idList') idList: ElementRef | any;
  @ViewChild('idFormShared') idFormShared: ElementRef | any;

  constructor(
    private _renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    this.reziseWindowList();
  }

  ngOnInit(): void {
    console.log("INICIO DE LISTA SHARED");
    //console.log(this.dataStructureListReceived);
    this.dataStructureList = this.dataStructureListReceived;
  }

  redirectToFormulario(objectSelected: any) {
    console.log("IN LIST");
    //console.log(objectSelected);
    this.structureFormSend = new DataStructureFormShared();
    this.structureFormSend.component = this.dataStructureListReceived.component;
    this.structureFormSend.title = this.dataStructureListReceived.title;
    this.structureFormSend.titleDos = this.dataStructureListReceived.titleDos;
    //Objeto inicializado - viene de cada componente
    this.structureFormSend.object = this.dataStructureList.objectOfLista;

    if(objectSelected === CONSTANTES.CONST_TEXT_VACIO) {
      this.structureFormSend.object.name=CONSTANTES.CONST_TEXT_VACIO;
      this.structureFormSend.action=CONSTANTES.CONST_TEXT_BTN_REGISTRAR;
    } else {
      this.structureFormSend.action=CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
      this.structureFormSend.imagen = objectSelected.image;
      this.structureFormSend.object=objectSelected;
    }

    //console.log(this.structureFormSend);
    this.emitResponseToForm.emit(this.structureFormSend);
  }

  // redirectToFormulario(objectSelected: any) {
  //   console.log("redirecto");
  //   console.log(objectSelected);
  //   this.structureFormSend = new DataStructureFormSharedFormShared();
  //   this.structureFormSend.component = this.dataStructureListReceived.component;
  //   this.structureFormSend.title = this.dataStructureListReceived.title;
  //   this.structureFormSend.titleDos = this.dataStructureListReceived.titleDos;

  //   //this.structureFormSend.object = this.dataStructureList.objectOfLista;

  //   if(objectSelected === CONSTANTES.CONST_TEXT_VACIO) {
  //     this.structureFormSend.action=CONSTANTES.CONST_TEXT_BTN_REGISTRAR;
  //     //this.structureFormSend.object=null;
  //   } else {
  //     this.structureFormSend.action=CONSTANTES.CONST_TEXT_BTN_ACTUALIZAR;
  //     this.structureFormSend.imagen = objectSelected.image;
  //     this.structureFormSend.object=objectSelected;
  //   }

  //   this.emitResponseToForm.emit(this.structureFormSend);
  // }


  reziseWindowList() {
    let windowHeight = window.innerHeight;
    setTimeout(()=> {
      let heightForm = this.idFormShared.nativeElement.clientHeight;

      let compare = (this.dataStructureListReceived.onlyListItems===false?windowHeight*0.5:windowHeight-20);
      if(heightForm > compare){
        this._renderer.setStyle(this.idList.nativeElement,"height",(windowHeight*0.55)+"px");
        this._renderer.setStyle(this.idList.nativeElement,"overflow-y","scroll");
      }
    },200);
  }

}
