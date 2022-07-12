import { Component, OnInit } from '@angular/core';
import { OwnerModel } from 'app/data/models/business/owner.model';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent implements OnInit {

  active_menu_click: boolean = false;
  showAside: boolean = false;
  jsonOwner : OwnerModel = new OwnerModel();

  constructor() {
    this.jsonOwner.id=1;
    this.jsonOwner.username="erosales";
    this.jsonOwner.name="Ever Rosales Peña";
    this.jsonOwner.email="everjrosalesp@gmail.com";
    this.jsonOwner.image="https://firebasestorage.googleapis.com/v0/b/usuarios-8190a.appspot.com/o/users%2Fever_1651713221827?alt=media&token=6f0bef77-a2d9-4ecd-855a-402b75be65b8";
    this.jsonOwner.createAt= new Date("2010-02-02T05:00:00.000+00:00");
    localStorage.setItem("lcstrg_owner",JSON.stringify(this.jsonOwner));
  }

  ngOnInit(): void {
  }


  ReceivedshowMenuNow(event: boolean) {
    this.showAside = true;
    setTimeout(() => {
      this.active_menu_click = event;
    }, 50);
    
  }

  ReceivedgHiddenMenuNow(event: boolean) {
    this.active_menu_click = event;
    setTimeout(() => {
      this.showAside = false;
    }, 1000);
  }
}
