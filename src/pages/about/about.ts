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

  //public newQuantity: number;
  responseTxt: any;
  data: Observable<any>;

  result: BarcodeScanResult;
  id_wine: number;
  name: Text;
  newQuantity: number;
  quantity: number;
  year: number;
  resultScan: Observable<any>;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient, public network: NetworkEngineProvider) {

  }
  
  updateTable(id, newQuantity) {
    let postData = new FormData()
    postData.append('wineid', id)
    postData.append('quantity', newQuantity)
    this.data = this.httpClient.post('https://cpnvproj1.ngrok.io/TPI/site/update.php', postData)
    this.data.subscribe( data => {
      //this.responseTxt = data
      this.responseTxt = "Le nouveau stock a été mis à jour !";
    })
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
