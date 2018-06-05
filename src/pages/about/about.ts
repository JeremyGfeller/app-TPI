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
  public update = [];
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

    storage.get('update').then((data) => {
      this.update = data;
      if(data == null)
      {
        this.update = [] = [];
      }
    })
  }
  
  updateTable(id, newQuantity, movement_type) {
    this.update.push({'id_wine': id, 'newQuantity': newQuantity, 'movement_type': movement_type});
    this.storage.set('update', this.update); 
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  sync()
  {
    let postDataOut = new FormData()
    postDataOut.append('update', JSON.stringify(this.update))
    this.data = this.httpClient.post('https://cpnvproj1.ngrok.io/TPI/site/update.php', postDataOut)
    this.data.subscribe( data => {
      if(data == 'ok')
      {
        this.storage.remove('update');
        this.toastCtrl.create({
          message: 'syncro ok',
          duration: 3000
        }).present();
        this.storage.get('update').then((data) => {
          this.storage.remove('update');
        })
        //window.location.reload();
      }
    })
    this.resultSync = this.httpClient.get(this.url + "stock.php");
    this.resultSync
    .subscribe(data => {
      this.allWines = data;
      this.storage.set('allWines', this.allWines);
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
        this.allWines.forEach((wine) => {
          if(wine.id_vintage == res.text)
          {
            this.id_wine = wine.id_vintage;
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
  }
}
