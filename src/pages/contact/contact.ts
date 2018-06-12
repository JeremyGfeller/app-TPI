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

  public users = [];
  public currentUser = [];
  resultUsers: Observable<any>;
  id_user : number;
  loginUser : string;
  //url: string = "https://cpnvproj1.ngrok.io/TPI/site/";
  url : string = "http://cercledyverdon.ch/cave/app/";

  constructor(public navCtrl: NavController, private storage: Storage, private httpClient: HttpClient, public platform: Platform) {

    this.resultUsers = this.httpClient.get(this.url + "users.php");
    this.resultUsers
    .subscribe(data => {
      this.users = data;
      this.storage.set('users', this.users);
    })

    storage.get('currentUser').then((data) => {
      this.currentUser = data;
    })
  }

  app(loginUser)
  {
    this.currentUser = ([loginUser]);
    this.storage.set('currentUser', this.currentUser); 
    location.reload();
  }

  sync()
  {
    location.reload();
  }
}
