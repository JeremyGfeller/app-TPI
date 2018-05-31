import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public allWines = [];
  responseTxt: any;
  data: Observable<any>;
  resultSync : Observable<any>;

  result: BarcodeScanResult;
  id_wine: number;
  name: Text;
  newQuantity: number;
  quantity: number;
  year: number;
  resultScan: Observable<any>;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/";

  constructor(public navCtrl: NavController, private storage: Storage, public platform: Platform, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient, public network: NetworkEngineProvider) {
    storage.get('allWines').then((data) => {
      this.allWines = data;
    })
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

  sync()
  {
    this.resultSync = this.httpClient.get(this.url + "stock.php");
    this.resultSync
    .subscribe(data => {
      this.allWines = data;
      this.storage.set('allWines', this.allWines);
    })
  }

  scanQR()
  {
    this.platform.ready().then(() => {
      const options: BarcodeScannerOptions = {
        prompt: 'Pointez votre caméra vers un code barre',
        torchOn: false
      };

      // Push to master : git push ionic master
      /* Scan the QR-Code and the data appear */
      this.bcs.scan(options)
      .then(res => {
          this.allWines.forEach((wine) => {
            if(wine.id_wine == res.text)
            {
              this.name = wine.name;
              this.year = wine.year;
              this.quantity = wine.quantity;
            }
        })
      })
      .catch(err => {
          this.toastCtrl.create({
            message: err.message
          }).present();
      })
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
