import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-visualizador-voucher',
  templateUrl: './visualizador-voucher.component.html',
  styleUrls: ['./visualizador-voucher.component.css']
})
export class VisualizadorVoucherComponent implements OnInit {

  @Input("receivedVoucher") receivedVoucher: string = '';
  @Output() sendResponseFromVoucherShowToParent : EventEmitter<any> = new EventEmitter();
  @ViewChild("containerShowVoucher") 
  containerShowVoucher: ElementRef | any;

  constructor(private _renderer: Renderer2,) {
    this._renderer.listen('window','click',(e: Event)=> {
        if(this.containerShowVoucher && e.target === this.containerShowVoucher.nativeElement) {
          this.hiddenCalendar();
        }
    });
  }

  ngOnInit(): void {
  }

  hiddenCalendar() {
    this.sendResponseFromVoucherShowToParent.emit(false);
  }

}
