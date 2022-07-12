import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

firebase.initializeApp(environment.firebaseConfig)

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageRef = firebase.app().storage().ref();

  // versiones anteriores de firebase ::: storageRef = firebase.storage().ref();

  constructor() { }

  async uploadImage(name: string, imgBase64:any, bucket: string) {
      try {
        let response = await this.storageRef.child(bucket+"/"+name).putString(imgBase64, 'data_url');
        return await response.ref.getDownloadURL();
      } catch (error) {
        console.log("response error");
          return null;
      }
  }


}
