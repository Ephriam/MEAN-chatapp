import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ShareService } from './share.service';
@Injectable()
export class ChatService {

  baseUrl  = this._share.baseUri

  socket

  constructor(private _http: HttpClient, private _share: ShareService ) { }

  getUsers() {
    let headers = new HttpHeaders().set('Authorization', localStorage.Authorization)
    return this._http.post(this.baseUrl + 'api/user/', {}, {headers: headers})
  }

  getChats(to) {
    let headers = new HttpHeaders().set('Authorization', localStorage.Authorization)
    return this._http.post(this.baseUrl + 'api/user/chats', {to: to}, {headers: headers})
  }

  initChat() {
    this.socket = io(this.baseUrl).
    on('connect', (so) => {
      this.socket.on('confirm', (data) => {
      })
    })
  }
}
