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
      storage.get('allWines').then((data) => {
        this.allWines = data;
      })

      storage.get('movements').then((data) => {
        this.movements = data;
      })
  }

  sync() {
    //this.platform.ready().then(() => {
      
      let postData = new FormData()
      postData.append('movements', JSON.stringify(this.movements))

      this.data = this.httpClient.post('https://cpnvproj1.ngrok.io/TPI/site/out.php', postData)
      this.data.subscribe( data => {
        //this.response = data
        if(data == 'ok')
        {
          this.toastCtrl.create({
            message: 'syncro ok'
          }).present();
        }
      })
      
      /*postData.append('idWine', id_wine)
      postData.append('quantity', Quantity)
      postData.append('pseudo', first_name)
      this.data = this.httpClient.post('https://cpnvproj1.ngrok.io/TPI/site/out.php', postData)
      this.data.subscribe( data => {
        //this.response = data
        this.response = "Les bouteilles ont été retirées !";
      })*/

      this.resultSync = this.httpClient.get(this.url + "stock.php");
      this.resultSync
      .subscribe(data => {
        this.allWines = data;
        this.storage.set('allWines', this.allWines);
      })
    //})
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
        this.response = res.text;
          this.allWines.forEach((wine) => {
            this.response += ('/' + JSON.stringify(wine));
            /*this.response += wine.id_wine;
            this.response += wine.name;*/
            if(wine.id_wine == res.text)
            {
              this.name = wine.name;
              this.year = wine.year;
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

  scanQRtest()
  {
    let res = 1;
      this.allWines.forEach((wine) => {
        console.log(wine);
        if(wine.id_wine == res)
        {
          this.name = wine.name;
          this.year = wine.year;
        }
    })
  }
}
