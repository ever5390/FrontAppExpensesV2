import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CONSTANTES } from '@data/constantes';
import { OwnerModel } from '@data/models/business/owner.model';
import { UserService } from '@data/services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

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
   
  constructor(
    private _usuarioService: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    if(this._usuarioService.isAuthenticated()){
        this._router.navigate(["/"]);
    }
  }

  signUpOwner() {
    if(this.validateCamposSignUp() == false)
    return;

    this.usuario.image = this.urlFotoDefault;
    this._usuarioService.create(this.usuario).subscribe(
        response => {
          Swal.fire(response.title, response.message, response.status);
          console.log(response);
          this.flagIsLoginAction = true;
          this._router.navigate(['/']);
        }, err => {
          console.log(err);
          Swal.fire(err.error.title,err.error.message, err.error.status);
  
        }
      )
  }

  loginOwner() : void{

    if(this.validateCamposLogin() == false)
        return;

    this._usuarioService.login(this.usuario).subscribe(
        response => {
                console.log(response);
                this._usuarioService.guardarUsuario(response.access_token);
                this._usuarioService.guardarToken(response.access_token);

                let usuario = this._usuarioService.usuario;
                Swal.fire("Login",`Hola ${usuario.username}, has iniciado sessión con éxito`,"success")
                this._router.navigate(['/']);                
            }, err => {
                Swal.fire("Error Login",err.message,"error")
                console.log(err);
                if(err.status = 400) {
                
                    var message = 'Usuario o password incorrectos';
                    if(err.error.error_description == 'User is disabled') {
                        message = 'El usuario '+this._usuarioService.usuario.username+' se encuentra bloqueado, comuníquese con el administrador al siguiente correo: everjrosalesp@gmail.com';
                    }

                    Swal.fire("Login",`${message}`,"info")
                
                }
            }
        )
    }


  changeInputTypeForViewPassword() {
    if(this.btnViewPassword) {
      this.btnViewPassword = false;
    } else {
        this.btnViewPassword = true;
    }

    let elemento :any = document.getElementById('password');
    if((this.usuario.password != "" && this.usuario.password != null)) {
        if( elemento.type == 'text') {
            elemento.type = "password";
        } else {
            elemento.type = "text";
        }
    }
  }
 
  changeAction() {
    this.usuario = new OwnerModel;
    if(this.flagIsLoginAction == true) {
        this.flagIsLoginAction = false;
        this.titleAction = "Sign Up";
        this.textAction = "Sign in here";
        this.textDescription = "Already have an account?";
    } else {
        this.flagIsLoginAction = true;
        this.titleAction = "Sign in";
        this.textDescription = "Don't have an account?";
        this.textAction = "Click here to sign up";
    }
  }

  detectedValidPassword() {

      if(this.flagIsLoginAction)
          return;
      
      let elemento :any = document.getElementById('range_bar_mobile');
      let sizePassword = this.usuario.password.length;
      let uppercaseLetters="ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";
      let lowercaseLetters="abcdefghyjklmnñopqrstuvwxyz";
      let numbers="1234567890";
      let contentCoincidencesNumber = 0;

      if(sizePassword >= 8 ) {
          contentCoincidencesNumber++;
      }

      for(let i=0; i<this.usuario.password.length; i++){
          if (uppercaseLetters.indexOf(this.usuario.password.charAt(i),0)!=-1){
              contentCoincidencesNumber++;
              break;
          } 
      }

      for(let i=0; i<this.usuario.password.length; i++){
          if (lowercaseLetters.indexOf(this.usuario.password.charAt(i),0)!=-1){
              contentCoincidencesNumber++;
              break;
          }
      }

      for(let i=0; i<this.usuario.password.length; i++){
          if (numbers.indexOf(this.usuario.password.charAt(i),0)!=-1){
              contentCoincidencesNumber++;
              break;
          }
      }
      
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

  validateCamposSignUp(): boolean {
      if(this.usuario.name == "" || this.usuario.name == null) {
          Swal.fire("Advertencia","El campo full name no puede estar vacío", "info");
          return false;
      }
      if(this.usuario.email == "" || this.usuario.email == null) {
        Swal.fire("Advertencia","El campo email no puede estar vacío", "info");
        return false;
      }
      if(this.usuario.password == "" || this.usuario.password == null) {
          Swal.fire("Advertencia","Campo password no puede estar vacío", "info");
          return false;
      }

      this.validateCamposLogin();

      return true;
  }

  validateCamposLogin(): boolean {
    // if(this.usuario.username == "" && this.usuario.password == "") {
    //     swal.fire("Advertencia","Los campos username y password no pueden estar vacíos", "info");
    //     return false;
    //}
    if(this.usuario.username == "" || this.usuario.username == null) {
      Swal.fire("Advertencia","Campo username no puede estar vacío", "info");
      return false;
    }
    if(this.usuario.password == "" || this.usuario.password == null) {
        Swal.fire("Advertencia","Campo password no puede estar vacío", "info");
        return false;
    }

    return true;
  }



}

