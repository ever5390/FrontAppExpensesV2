import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-body-expense',
  templateUrl: './body-expense.component.html',
  styleUrls: ['./body-expense.component.css']
})
export class BodyExpenseComponent implements OnInit {

  sendListExpensesToBodyList: any[] = [];
  @Input("receivedHeightHeaderToBody") receivedHeightHeaderToBody:string = '';
  @Input("receivedListExpensesFromSkeleton") receivedListExpensesFromSkeleton:any = [];
  @Output() sendExpenseToUpdateStatausPay = new EventEmitter();
  @ViewChild('contentList') contentList: ElementRef  | any;

  constructor(
    private _renderer: Renderer2
  ) { 
  }

  ngOnInit(): void {
    //console.log("HELLO BODY");
    //console.log(this.receivedListExpensesFromSkeleton);
    this.sendListExpensesToBodyList = this.receivedListExpensesFromSkeleton;
  }

  updatePayedExpense(idExpenseUpdate: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Este procedimiento marcará el gasto seleccionado como pagado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendExpenseToUpdateStatausPay.emit(idExpenseUpdate);
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(()=>{      
      this._renderer.setStyle(this.contentList.nativeElement,"height", (parseInt(this.receivedHeightHeaderToBody) - 110)+"px");
      this._renderer.setStyle(this.contentList.nativeElement,"overflow-y","scroll");
    },500);
  }

}
