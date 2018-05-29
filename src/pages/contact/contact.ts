import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public allWines = [];
  responseTxt: any;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/stock.php";
  result : Observable<any>;


  constructor(public navCtrl: NavController, private storage: Storage, private httpClient: HttpClient, public platform: Platform) {
    
  }

  sync() {
    this.platform.ready().then(() => {
      this.result = this.httpClient.get(this.url);
      this.result
      .subscribe(data => {
        this.allWines = data;
      })
      //this.storage.set('allWines', this.allWines);
    })
  }
}
