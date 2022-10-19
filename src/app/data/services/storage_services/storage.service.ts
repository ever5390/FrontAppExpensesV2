import { Injectable } from '@angular/core';
import { URL_BASE_API_V1 } from 'app/config/global.url';
import { environment } from 'environments/environment';
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import Swal from 'sweetalert2';

firebase.initializeApp(environment.firebaseConfig)

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageRef = firebase.app().storage().ref();
  enviroment = URL_BASE_API_V1;
  // versiones anteriores de firebase ::: storageRef = firebase.storage().ref();

  constructor() { }

  async uploadImage(name: string, imgBase64:any, bucket: string) {
    let enviromenFolder = "development";
    if(!this.enviroment.includes("localhost")) enviromenFolder = "production"
    
    try {
      let response = await this.storageRef.child(enviromenFolder+"/"+bucket+"/"+name).putString(imgBase64, 'data_url');
      return await response.ref.getDownloadURL();
    } catch (error) {
     Swal.fire("","No se pudo procesar la imagen seleccionada","info");
      return null;
    }
  }


}
