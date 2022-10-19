import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { StructureFormSharedModel } from '@shared/interfaces/shared-structure-fom.model';
import { OwnerModel } from 'app/data/models/business/owner.model';
import { DataStructureFormShared } from 'app/data/models/Structures/data-structure-form-shared.model';
import { SLoaderService } from '../loaders/s-loader/service/s-loader.service';

@Component({
  selector: 'app-formulario-shared',
  templateUrl: './formulario-shared.component.html',
  styleUrls: ['./formulario-shared.component.css']
})
export class FormularioSharedComponent implements OnInit {
  
  fotoSeleccionada: File | undefined;
  owner: OwnerModel = new OwnerModel();
  
  @Output() responseToFatherComponent = new EventEmitter<any>();
  @Input() dataReceivedFormRegister: StructureFormSharedModel = new StructureFormSharedModel();
  
  selectGroup: number = 0;
  show__popup: boolean =  false;

//Mientras payment method no cambie
  @Input() dataStructureReceived: DataStructureFormShared = new DataStructureFormShared();


  @ViewChild('imgFormulary') imgFormulary: ElementRef | any;
  @ViewChild('popup__formulario') popup__formulario: ElementRef | any;

  constructor(
    private _renderer: Renderer2,
    private _loadSpinnerService: SLoaderService
  ) {
    this.catchClickEventOutForm();
  }

  ngOnInit(): void {
    this.detectedIfCategory();
    this._loadSpinnerService.hideSpinner();
  }

  detectedIfCategory() {
   if(this.dataReceivedFormRegister.listaShow){
    this.selectGroup = this.dataReceivedFormRegister.object.group.id;
   }
  }

  action(action : number) {
    this._loadSpinnerService.showSpinner();
    if(action == 0) { //Delete
      this.responseToFatherComponent.emit({"orden": 0, "structureData" : this.dataReceivedFormRegister});
      return;
    }
    //Save / Update
    this.responseToFatherComponent.emit({"orden": 1, "structureData" : this.dataReceivedFormRegister});
  }

  uploadFoto(event: any) {
    if(event.target.files && event.target.files[0]) {
      this.dataReceivedFormRegister.imgDefault = event.target.files[0];
      this.fotoSeleccionada = event.target.files[0];
      const objectURL = URL.createObjectURL(event.target.files[0]);
      this._renderer.setAttribute(this.imgFormulary.nativeElement,"src",objectURL);
    }
  }

  chooseItemGroup(){
    let listaGroup = this.dataReceivedFormRegister.lista;

    if(this.selectGroup == 0) {
      this.dataReceivedFormRegister.object.group.id = 0;
      return;
    }

    for (let index = 0; index <  listaGroup.length; index++) {
      if(this.selectGroup == listaGroup[index].id) {
        this.dataReceivedFormRegister.object.group =  listaGroup[index];
        break;
      }
    }

     
  }

  catchClickEventOutForm() {
    this._renderer.listen('window','click', (e: Event)=> {
      if( this.popup__formulario && e.target === this.popup__formulario.nativeElement){
        this.responseToFatherComponent.emit(null);
      }
    });
  }

}
