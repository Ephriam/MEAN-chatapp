import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
import { AuthService } from '../auth.service'
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {

  title = 'navbar'
  email
  password
  message  
  to
  users
  

  constructor(private _share: ShareService, public _auth: AuthService, private _chat: ChatService) { }

  ngOnInit() {
    this.title = this._share.title
  }
  
}
