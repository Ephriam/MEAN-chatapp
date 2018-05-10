import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from './share.service';

import * as io from 'socket.io-client'
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  constructor (private _router: Router, private _share: ShareService, private _auth: AuthService) {}

  ngOnInit() {
    if(localStorage.Authorization != "undefined"){
      this._auth.setIsLogged(true)            
    }
    this._router.navigate(['land'])
  }
}
