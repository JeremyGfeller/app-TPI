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

  response: any;
  Quantity: number;
  fournisseur: string;
  first_name: string;

  result: BarcodeScanResult;
  id_wine: number;
  name: Text;
  quantity: number;
  year: number;
  resultScan: Observable<any>;
  data: Observable<any>;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient, private alertCtrl: AlertController) {

  }

  in(id_wine, Quantity, fournisseur, first_name)
  {
    let postData = new FormData()
    postData.append('idWine', id_wine)
    postData.append('quantity', Quantity)
    postData.append('provider', fournisseur)
    postData.append('pseudo', first_name)
    this.data = this.httpClient.post('https://cpnvproj1.ngrok.io/TPI/site/in.php', postData)
    this.data.subscribe( data => {
      //this.responseTxt = data
      this.response = "Les bouteilles se sont ajoutées !";
    })
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
        this.resultScan = this.httpClient.get(this.url + "stock.php?id=" + res.text);
        this.resultScan
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
