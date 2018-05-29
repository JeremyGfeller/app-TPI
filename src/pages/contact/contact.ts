import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  typeWineTable : string[] = [];
  public db: SQLiteObject;
  responseTxt: any;
  responseTxt2: any;
  responseTxt3: any;
  responseTxt4: any;
  responseTxt5: any;
  responseTxt6: any;
  url: string = "https://cpnvproj1.ngrok.io/TPI/site/outDB.php";
  id_typewine: number;
  typewine: Text;
  id: number;
  result : Observable<any>;


  constructor(public navCtrl: NavController, private sqlite: SQLite, private httpClient: HttpClient, public platform: Platform) {

  }

  test()
  {
    this.result = this.httpClient.get(this.url);
    this.result
      .subscribe(data => {
        this.id_typewine = data[2].id_typeWine;
        this.typewine = data[2].typeWine;
      /*for(let i=0; i < data.length; i++)
      {
        this.id_typewine = data[i].id_typeWine;
        this.typewine = data[i].typeWine;
      } */
    });
  }

  sync() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'caveWine.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
            console.log('BD créée !');
            this.db = db;
            this.createTables();
        })
        .catch(e => console.log(e));
    })
  }
  
  private createTables(): void{
    this.db.executeSql('CREATE TABLE IF NOT EXISTS `typewine` ( `id_typeWine` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `typeWine` TEXT )', {})
    .then(() => {
      console.log('Table typewine created');
      this.responseTxt = 'Table typewine created';

      this.db.executeSql('CREATE TABLE IF NOT EXISTS `wine` ( `id_wine` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `name` TEXT, `provider` TEXT, `fk_typeWine` INTEGER, FOREIGN KEY(`fk_typeWine`) REFERENCES `typewine`(`id_typeWine`) ON DELETE NO ACTION ON UPDATE NO ACTION )', {})
      .then(() => {
        console.log('Table wine created');
        this.responseTxt += 'Table wine created';

        this.db.executeSql('CREATE TABLE IF NOT EXISTS `vintage` ( `id_vintage` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `fk_wine` INTEGER, `year` INTEGER, `qr_code` INTEGER, `quantity` INTEGER, `price` INTEGER, `date` TEXT, FOREIGN KEY(`fk_wine`) REFERENCES `wine`(`id_wine`) ON DELETE NO ACTION ON UPDATE NO ACTION )', {})
        .then(() => {
          console.log('Table vintage created');
          this.responseTxt += 'Table vintage created';

          this.db.executeSql('CREATE TABLE IF NOT EXISTS `movement` ( `id_movement` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `fk_users` INTEGER, `fk_vintage` INTEGER, `movement_in` INTEGER, `movement_out` INTEGER, `provider_other` TEXT, `date` TEXT, FOREIGN KEY(`fk_vintage`) REFERENCES `vintage`(`id_vintage`) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(`fk_users`) REFERENCES `users`(`id_users`) ON DELETE NO ACTION ON UPDATE NO ACTION )', {})
          .then(() => {
            console.log('Table movement created');
            this.responseTxt += 'Table typewine created';

            this.db.executeSql('CREATE TABLE IF NOT EXISTS `users` ( `id_users` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `first_name` TEXT, `last_name` TEXT, `login` TEXT, `password` TEXT, `role` INTEGER )', {})
            .then(() => {
              this.responseTxt += 'Table users created';
              this.insertValues();
            })
            .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }

  // INSERT INTO `typewine`(`id_typeWine`,`typeWine`) VALUES (2,NULL);
  private insertValues(): void {
    this.result = this.httpClient.get(this.url);
    this.result
      .subscribe(data => {
        this.responseTxt += JSON.stringify(data)
        for(let i=0; i < data.length; i++)
        {
          this.id_typewine = data[i].id_typeWine;
          this.typewine = data[i].typeWine;
          let query = 'INSERT INTO `typewine`(`id_typeWine`,`typeWine`) VALUES (' + this.id_typewine + ',' + this.typewine + ')';
          this.db.executeSql(query, {}).then(() => {
            this.responseTxt += query
          })
        }
      })
  }
}
