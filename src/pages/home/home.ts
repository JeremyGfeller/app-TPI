import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public inputVal: string;

  resultat: any = [];

  result: BarcodeScanResult;
  id_wine: number;
  name: Text;
  quantity: number;
  year: number;
  users: Observable<any>;
  data: Observable<any>;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient, private alertCtrl: AlertController) {

  }

  showVall(){
    //this.data = this.httpClient.get(this.url + "addRemove.php?id=1&newQuantity=" + this.inputVal);
    //alert("inputValue " + this.inputVal);
    //alert("id_wine " + this.id_wine);

    let alert = this.alertCtrl.create({
      title: "id_wine " + this.id_wine,
      subTitle: "inputValue " + this.inputVal,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  scanQR()
  {
    const options: BarcodeScannerOptions = {
      prompt: 'Pointez votre caméra vers un code barre',
      torchOn: false
    };

    // Push to master : git push ionic master
    /* Scan the QR-Code and the data appear */
    this.bcs.scan(options)
    .then(res => {
        this.users = this.httpClient.get(this.url + "addRemove.php?id=" + res.text);
        this.users
        .subscribe(data => {
          this.id_wine = data.id_wine;
          this.name = data.name;
          this.year = data.year;
          this.quantity = data.quantity;
        })
    })
    .catch(err => {
        this.toastCtrl.create({
          message: err.message
        }).present();
    })
  }
}
