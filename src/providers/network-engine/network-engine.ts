import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the NetworkEngineProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkEngineProvider {

  constructor(public http: HttpClient) {
    console.log('Hello NetworkEngineProvider Provider');
  }

  updateTable(id, newQuantity) : Promise<any>
  {
    let url = "https://cpnvproj1.ngrok.io/TPI/site/update.php";
    console.log(url);
    let param = { id_wine: id, newQuantity: newQuantity};
    console.log(param);
    let request = this.http.post(url, param);
    console.log(request);
    return request.toPromise();
  }
  
}
