import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient) {

  }

  scanBarcode()
  {
    const options: BarcodeScannerOptions = {
      torchOn: false
    };

    // Push to master : git push ionic master
    /* Scan the QR-Code and the data appear */
    this.bcs.scan(options)
        .then(res => {
            /*this.article = this.httpClient.get(this.url + "api.php?id=" + res.text);
            this.article
            .subscribe(data => {
                this.idArticle = data.id_article;
                this.stock = data.quantity;
                this.brand = data.brand;
                this.illustration = this.url + "images/articles/" + data.illustration;
                this.model_name = data.model_name;
                this.prix = data.model_prix;
                this.size = data.size;
                this.color = data.color;
            })*/
        })
        .catch(err => {
            this.toastCtrl.create({
                message: err.message
            }).present();
        })
  }

}
