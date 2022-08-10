import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@data/services/user/user.service';
import { OwnerModel } from 'app/data/models/business/owner.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent implements OnInit {

  active_menu_click: boolean = false;
  showAside: boolean = false;
  jsonOwner : OwnerModel = new OwnerModel();
  

  constructor(
    private _usuarioService: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    if(!this._usuarioService.isAuthenticated()) {
      this._router.navigate(['/dashboard']);
      return;
    } 
    
    this._router.navigate(['/dashboard']);
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
