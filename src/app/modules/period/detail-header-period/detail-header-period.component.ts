import { Component, Input, OnInit } from '@angular/core';
import { PeriodDetailHeader } from 'app/data/models/business/periodDetailHeader.model';

@Component({
  selector: 'app-detail-header-period',
  templateUrl: './detail-header-period.component.html',
  styleUrls: ['./detail-header-period.component.css']
})
export class DetailHeaderPeriodComponent implements OnInit {


  @Input() periodDetailHeaderReceived: PeriodDetailHeader = new PeriodDetailHeader();

  constructor() { }

  ngOnInit(): void {
  }

}
