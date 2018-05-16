import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public inputVal: string;
  responseTxt: any;

  result: BarcodeScanResult;
  id_wine: number;
  name: Text;
  quantity: number;
  year: number;
  users: Observable<any>;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient, public network: NetworkEngineProvider) {

  }
  
  updateVal(id, numberWine){

    this.network.updateTable(this.id_wine, this.inputVal).then(data => {
      console.log("J'ai reçu : " + JSON.stringify(data));
      this.responseTxt = "" + JSON.stringify(data);
    })

    //this.data = this.httpClient.get(this.url + "addRemove.php?id=1&newQuantity=" + this.inputVal);
    //alert("inputValue " + this.inputVal);
    //alert("id_wine " + this.id_wine);

    /*let alert = this.alertCtrl.create({
      title: "id_wine " + this.id_wine,
      subTitle: "inputValue " + this.inputVal,
      buttons: ['Dismiss']
    });
    alert.present();*/
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
        this.users = this.httpClient.get(this.url + "stock.php?id=" + res.text);
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
