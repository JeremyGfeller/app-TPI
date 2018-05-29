import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public allWines = [];
  public movements = [];
  resultSync : Observable<any>;
  response: any;
  response2: string [] = [];
  Quantity: number;
  fournisseur: string;
  login: string;

  result: BarcodeScanResult;
  id_wine: number;
  name: Text;
  quantity: number;
  year: number;
  resultScan: Observable<any>;
  data: Observable<any>;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/";

  constructor(public navCtrl: NavController, private storage: Storage, public platform: Platform, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient, private alertCtrl: AlertController) {

  }

  sync() {
    this.platform.ready().then(() => {
      this.resultSync = this.httpClient.get(this.url + "stock.php");
      this.resultSync
      .subscribe(data => {
        this.allWines = data;
      })
      //this.storage.set('allWines', this.allWines);
    })
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
      this.response = "Les bouteilles ont été ajoutées !";
    })
  }

  out(id_wine, Quantity, login)
  {
    this.movements.push({'id_wine': id_wine, 'movement_out': Quantity, 'login': login});
    this.storage.set('movements', this.movements);

    /*let postData = new FormData()
    postData.append('idWine', id_wine)
    postData.append('quantity', Quantity)
    postData.append('pseudo', first_name)
    this.data = this.httpClient.post('https://cpnvproj1.ngrok.io/TPI/site/out.php', postData)
    this.data.subscribe( data => {
      //this.response = data
      this.response = "Les bouteilles ont été retirées !";
    })*/ 
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
