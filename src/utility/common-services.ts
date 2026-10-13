import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {
  userKey = '';
  mobileNumber= ''
  setUserKey(userKey:string){
    this.userKey = userKey;
  }

  getUserKey(){
    return this.userKey;
  }

  setMobileNumber(number:string){
    this.mobileNumber = number;
  }

  getMobileNumber(){
    return this.mobileNumber;
  }

}


export function getReferenceNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}
