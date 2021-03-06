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
  public users = [];
  public movements = [];
  public currentUser = [];
  resultSync : Observable<any>;
  response: any;
  response2: string [] = [];
  Quantity: number;
  fournisseur: string;
  login: string;
  id_user : number;
  loginUser : string;
  result: BarcodeScanResult;
  id_wine: number;
  id_vintage: number;
  quantity: number;
  name: Text;
  year: number;
  resName: Text;
  resYear: number;
  resultScan: Observable<any>;
  data: Observable<any>;
  //url: string = "https://cpnvproj1.ngrok.io/TPI/site/";
  url : string = "http://cercledyverdon.ch/cave/app/";

  constructor(public navCtrl: NavController, private storage: Storage, public platform: Platform, public toastCtrl: ToastController, private bcs: BarcodeScanner, public httpClient: HttpClient, private alertCtrl: AlertController) {
      storage.get('allWines').then((data) => {
        this.allWines = data;
      })

      storage.get('movements').then((data) => {
        this.movements = data;
        if(data == null)
        {
          this.movements = [];
        }
      })

      this.storage.get('currentUser').then((data) => {
        this.loginUser = data;
      })
  }

  del()
  {
    this.storage.get('movements').then((data) => {
      this.storage.remove('movements');
      this.movements = []
    })
  }

  sync() 
  {
    let postData = new FormData()
    postData.append('movements', JSON.stringify(this.movements))
    this.data = this.httpClient.post(this.url + "inout.php", postData)
    this.data.subscribe( data => {
      if(data == 'ok')
      {
        this.toastCtrl.create({
          message: 'syncro ok',
          duration: 3000
        }).present();
        this.storage.get('movements').then((data) => {
          this.storage.remove('movements');
          this.movements = []
        })
      }
    })

    this.resultSync = this.httpClient.get(this.url + "stock.php");
    this.resultSync
    .subscribe(data => {
      this.allWines = data;
      this.storage.set('allWines', this.allWines);
    })

    this.storage.get('currentUser').then((data) => {
      this.loginUser = data;
    })
  }

  movement(id_wine, movement_type, Quantity, fournisseur, login)
  {
    if(id_wine == undefined || Quantity == undefined || login == undefined)
    {
      this.toastCtrl.create({
        message: 'Veuillez scanner un QR Code, entrez une quantité ou entrez votre login',
        duration: 7000
      }).present();
    }
    else
    {
      this.allWines.forEach((wine) => 
      {
        if(wine.id_vintage == id_wine)
        {
          this.resName = wine.name;
          this.resYear = wine.year;
          this.movements.push({'id_wine': id_wine, 'movement_type': movement_type, 'nb_bottle': Quantity, 'fournisseur': fournisseur, 'login': login[0], 'name': this.resName, 'year': this.resYear});
        }
      })
      this.storage.set('movements', this.movements); 
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }
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
            if(wine.id_vintage == res.text)
            {
              this.id_wine = wine.id_vintage;
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
}
