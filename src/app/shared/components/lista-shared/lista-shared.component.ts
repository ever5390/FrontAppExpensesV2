import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-lista-shared',
  templateUrl: './lista-shared.component.html',
  styleUrls: ['./lista-shared.component.css']
})
export class ListaSharedComponent implements OnInit {

  flagFormulario: boolean = false;
  sendBtnText: string = '';

  @Input() title: string = '';
  @Input() imagen: string = '';
  @Input() onlyListItems: boolean = true; 

  @ViewChild('idList') idList: ElementRef | any;
  @ViewChild('idFormShared') idFormShared: ElementRef | any;

  constructor(
    private _renderer: Renderer2
  ) {
  }

  ngAfterViewInit() {
    let windowHeight = window.innerHeight;
    let heightForm = this.idFormShared.nativeElement.clientHeight;

    //IF onlyListItems is FALSE :: Viene desde una cuenta para anadir categorias
    //Definiendo valores de acuerdo a de donde es llamado este componente
    let compare = (this.onlyListItems==false?windowHeight*0.5:windowHeight-20);

    if(heightForm > compare){
      this._renderer.setStyle(this.idList.nativeElement,"height",(windowHeight*0.5)+"px");
      this._renderer.setStyle(this.idList.nativeElement,"overflow-y","scroll");
    }

  }

  ngOnInit(): void {
  }

  redirectToFormulario(textBtn: string) {
    this.sendBtnText = textBtn;
    this.flagFormulario = true;
  }

  receiveToSonComponent(e:any) {
    this.flagFormulario = false;
  }

}
