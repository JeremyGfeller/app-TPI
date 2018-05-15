import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  result: BarcodeScanResult;
  id_users: number;
  first_name: Text;
  last_name: Text;
  login: Text;
  role: number;
  users: Observable<any>;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient) {

  }

  scanBarcode()
  {
    const options: BarcodeScannerOptions = {
      prompt: 'Pointez votre caméra vers un code barre',
      torchOn: false
    };

    // Push to master : git push ionic master
    /* Scan the QR-Code and the data appear */
    this.bcs.scan(options)
        .then(res => {
            this.users = this.httpClient.get(this.url + "api.php?id=" + res.text);
            this.users
            .subscribe(data => {
                this.id_users = data.id_article;
                this.first_name = data.quantity;
                this.last_name = data.brand;
                this.login = data.login;
            })
        })
        .catch(err => {
            this.toastCtrl.create({
                message: err.message
            }).present();
        })
  }
}
