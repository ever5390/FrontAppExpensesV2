import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Output, EventEmitter, ComponentFactoryResolver, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Calendar } from 'app/data/models/calendar.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  date : Date =  new Date();
  dateSend: DateSend = new DateSend();
  showDateFull : string ='';
  showDateMonthAndYearCurrent: string = '';
  daysMonthPrev: number[] = [];
  daysMonthCurrent: number[] = [];
  daysMonthNext: number[] = [];
  today: number = 0;
  month: number = 0;
  count: number = 0;
  
  dateEnd: Date = new Date();
  dateInit: Date = new Date();
  inputValueDateInit: Date = new Date();
  inputValueDateEnd: Date = new Date();
  // showPopUpCalendar: boolean = true;



  cont: number = 0;
  indicelistaElements: number = 0;
  initial: any;
  final:any;

  @Output() sendDateRange = new EventEmitter<any>();
  @ViewChild("hashCOntentCalendar")
  hashCOntentCalendar!: ElementRef<any>;

  months: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];



  //Date Calendar
  dateSelectedInitial: Calendar  = new Calendar();
  dateSelectedFinal: Calendar = new Calendar();

  constructor(private _renderer: Renderer2,) { }

  ngAfterViewInit() {
    this._renderer.listen(this.hashCOntentCalendar.nativeElement,'click', (e: Event)=> {    
      //painting to select item      
     
      console.log("LISTEN");
      //catching to target select   
      if(this.cont == 1) {
        this.initial = e.target;
        this._renderer.setStyle( this.initial ,"background-color","#88beb2");
        this._renderer.setStyle( this.initial ,"border-radius","50%");

        this.dateSelectedInitial.itemHTML = this.initial; 
      }

      if(this.cont == 2) {
        this.final = e.target;
        this._renderer.setStyle(this.final ,"background-color","#88beb2");
        this._renderer.setStyle(this.final ,"border-radius","50%");
        this.dateSelectedFinal.itemHTML = this.final; 
      }
    });
  }

  ngOnInit(): void {
    //this.catchDate(1,0,1);
    this.renderCalendar();
   
   
  }

  renderCalendar() {

    this.today = new Date().getDate();
    this.month = new Date().getMonth();

    this.daysMonthPrev = [];
    this.daysMonthCurrent = [];
    this.daysMonthNext = [];

    this.date.setDate(1);
    //show fullDate
    this.showDateFull = new Date().toDateString();
    this.showDateMonthAndYearCurrent = this.months[this.date.getMonth()].concat(" ",this.date.getFullYear().toString());
  
    const lastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDate();
  
    const prevLastDay = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      0
    ).getDate();
  
    const firstDayIndex = this.date.getDay();
  
    const lastDayIndex = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDay();
  
    const nextDays = 7 - lastDayIndex - 1;
  
    for (let x = firstDayIndex; x > 0; x--) {
      this.daysMonthPrev.push(prevLastDay - x + 1);
    }
  
    for (let i = 1; i <= lastDay; i++) {
        this.daysMonthCurrent.push(i);
    }
  
    for (let i = 1; i <= nextDays; i++) {
      this.daysMonthNext.push(i);      
    }
  };

  getDateByDaySelected(daySelected: any) {

    this.dateSelectedInitial.dateSelected = this.date;
    console.log(this.date);

    this.initiFromFinalDate();

    
   // console.log(this.hashCOntentCalendar.nativeElement);
  
        
    // this.count++;

    // if(this.count > 1) {
    //   this.dateEnd = new Date(
    //     this.date.getFullYear(),
    //     this.date.getMonth(),
    //     daySelected);

    //     if(this.dateEnd < this.dateInit) {
    //       this.dateInit = this.dateEnd;
    //       // this.dateEnd = null;
    //     }

    //     if(this.dateEnd != null) {
    //       this.inputValueDateInit = this.dateInit;
    //       this.inputValueDateEnd = this.dateEnd;
    //       this.count = 0;
    //       //this.showSelectDateFilter();
    //       this.sendDateRangeToFather();
    //     }
        
    // } else {
    //   this.dateInit = new Date(
    //     this.date.getFullYear(),
    //     this.date.getMonth(),
    //     daySelected, 10,20,15);
       
    // }

}


initiFromFinalDate() {
  var lista =  document.querySelectorAll(".today_select");

    if(this.cont>1) {
      for (let index = 0; index < lista.length; index++) {
        // if(lista[index] != this.initial && lista[index]!= this.final){
            this._renderer.setStyle(lista[index] ,"background-color","#fff");
        // }
        //this._renderer.removeClass( this.initial ,"select_item_initial");
        //this._renderer.removeClass( this.final ,"select_item_final");
        this._renderer.removeStyle(this.final ,"background-color");
        this._renderer.removeStyle(this.final ,"border-radius");
        this._renderer.removeStyle(this.initial ,"background-color");
        this._renderer.removeStyle(this.initial ,"border-radius");
      }
      this.initial = null;
      this.final = null;
      this.cont = 0;
    }
    
    this.cont++;


    setTimeout(()=> {
      if(this.cont>1) {
        for (let index = 0; index < lista.length; index++) {
          if(this.initial == lista[index]){
            this.indicelistaElements = index;
            break;
          }
        }

        for (let index = this.indicelistaElements; index < lista.length; index++) {
          
          // this._renderer.removeStyle( this.initial ,"border-radius");
          // this._renderer.removeStyle( this.final ,"border-radius");
          this._renderer.setStyle(lista[index] ,"background-color","#dadada73");
          this._renderer.setStyle( this.initial ,"background-color","#88beb2");
          this._renderer.setStyle( this.final ,"background-color","#88beb2");
          // this._renderer.setStyle(this.initial ,"border-radius","50% 30% 0 50%");
          // this._renderer.setStyle(this.final ,"border-radius"," 0 50% 50% 0");
          if(this.final == lista[index]){
              break;
            }  
        }
      }

    },50);
}








  sendDateRangeToFather() {

    this.dateSend.startDate = this.inputValueDateInit.getFullYear() + "-" + (this.inputValueDateInit.getMonth()+1) + "-" + this.inputValueDateInit.getDate();
    this.dateSend.finalDate = this.inputValueDateEnd.getFullYear() + "-" + (this.inputValueDateEnd.getMonth()+1) + "-" + this.inputValueDateEnd.getDate()+ " 23:59:59";

    this.sendDateRange.emit({
      "to":"dashboard",
      "from":"calendar",
      "id":this.dateSend
    });
  }

  // showSelectDateFilter() {
  //   this.count = 0;
  //   this.showPopUpCalendar = !this.showPopUpCalendar;
  // }

  catchDate(orden:number, mes:number, dia:number){

    this.date = new Date();
    let discountDay = 0;
    if(orden == 1) {
      discountDay = new Date().getDate();
    }

    //INIT
    this.inputValueDateInit = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + mes,
      new Date().getDate() + dia - discountDay
    );

    //END - YESTERDAY
    if(mes == 0 && dia == -1) {
      this.inputValueDateEnd = this.inputValueDateInit;
    } else if(mes == -1 && dia == 1) {
      //END - MONTH AGO
      this.inputValueDateEnd = new Date(
        this.date.getFullYear(),
        this.date.getMonth() + 0,
        new Date().getDate() + 0 - discountDay
      );
    } else {
      this.inputValueDateEnd = new Date();
    }
    //this.showSelectDateFilter();
    this.sendDateRangeToFather();
  }

  getLastDayByMonthAndYear() {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    ).getDate();
  }

  goToPrev() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.renderCalendar();
  }

  goToNext() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.renderCalendar();
  }

  //ultimo día del mes anterior
  // const prevLastDay = new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   0
  // ).getDate();
}


export class DateSend {

  constructor(
    public startDate: string = "",
    public finalDate: string = ""
  ){}
}