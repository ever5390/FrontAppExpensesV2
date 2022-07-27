import { Component, OnInit } from '@angular/core';
import { CONSTANTES } from '@data/constantes';
import { OwnerModel } from '@data/models/business/owner.model';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

   //usuario: Owner;
   btnViewPassword: boolean = false;
   textValidatePassword: string = 'Write your password...';
   colorValidatePassword: string = '';
   widthValidatePassword: string = '';
   titleAction: string = 'Sign in';
   textAction: string ='Click here to sign up';
   textDescription: string= "Don't have an account?";
   flagIsLoginAction: boolean = true;
   urlFotoDefault: string = CONSTANTES.CONST_IMAGEN_DEFAULT;

   usuario: OwnerModel = new OwnerModel();
   
  constructor() { }

  ngOnInit(): void {
  }

  loginOwner() {

  }

  signUpOwner() {

  }

  changeInputTypeForViewPassword() {

  }
 
  changeAction() {

  }

  detectedValidPassword() {

      if(this.flagIsLoginAction)
          return;
      
      let elemento :any = document.getElementById('range_bar_mobile');
      //let sizePassword = this.usuario.password.length;
      let uppercaseLetters="ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";
      let lowercaseLetters="abcdefghyjklmnñopqrstuvwxyz";
      let numbers="1234567890";
      let contentCoincidencesNumber = 0;

      // if(sizePassword >= 8 ) {
      //     contentCoincidencesNumber++;
      // }

      // for(let i=0; i<this.usuario.password.length; i++){
      //     if (uppercaseLetters.indexOf(this.usuario.password.charAt(i),0)!=-1){
      //         contentCoincidencesNumber++;
      //         break;
      //     } 
      // }

      // for(let i=0; i<this.usuario.password.length; i++){
      //     if (lowercaseLetters.indexOf(this.usuario.password.charAt(i),0)!=-1){
      //         contentCoincidencesNumber++;
      //         break;
      //     }
      // }

      // for(let i=0; i<this.usuario.password.length; i++){
      //     if (numbers.indexOf(this.usuario.password.charAt(i),0)!=-1){
      //         contentCoincidencesNumber++;
      //         break;
      //     }
      // }
      
      switch (contentCoincidencesNumber) {
          case 1:
              this.textValidatePassword = "Easy peasy!";
              elemento.style.backgroundColor = '#FF1700';
              elemento.style.width = '25%';
              break;
          case 2:
              this.textValidatePassword = "That is a simple one";
              elemento.style.backgroundColor = '#F0A500';
              elemento.style.width = '50%';
              break;
          case 3:
              this.textValidatePassword = "That is better";
              elemento.style.backgroundColor = '#4D77FF';
              elemento.style.width = '75%';
              break;
          case 4:
              this.textValidatePassword = "Yeah! that password rocks ;)";
              elemento.style.backgroundColor = '#2EB086';
              elemento.style.width = '100%';
              break;
          default:
              this.textValidatePassword = "Write your password...";
              elemento.style.backgroundColor = 'transparent';
              elemento.style.width = '0%';
              break;
      }
      

  }

}
