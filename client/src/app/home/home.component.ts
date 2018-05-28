import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service'
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users
  chats
  mainChats = []
  to
  msg
  currentUser
  constructor(private _chat: ChatService, private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
      if(!this._auth.isLoggedIn()){
        return this._router.navigate([''])
      }
        this.getCurrentUser()
        this._chat.initChat()
        this._chat.socket.emit('Auth', {Authorization: localStorage.Authorization})
      //this.smallScreen(this.minDevice)
      this._chat.getUsers()
          .subscribe((res) => {
            this.users = res        
          },
           err => {
             localStorage.Authorization = undefined
           })
      this._chat.socket.on('message', (chat) =>{
        if(chat.from != chat.to){
          this.mainChats.push(chat)
        }
      })
  }

  sendMessage(){
    let body = {
      msg: this.msg,
      to: this.to,
      Authorization: localStorage.Authorization,
      date: new Date()
    }
    this._chat.socket.emit('message',body)
    this.mainChats.push(body)
  }

  getChats(){
    this._chat.getChats(this.to)
      .subscribe((res) => {
      this.mainChats = []
      this.mainChats = this.mainChats.concat(res)
    })
  }

  setReciver(to) {
    this.to = to
    this.getChats()
  }

  getChatClasses(chat){
    return this.currentUser._id == chat.to ? 'js-s '+ 'bg-wheat' : 'js-e ' + 'bg-white' 
  }

  getCurrentUser(){
    this._auth.getCurrentUser().
        subscribe(res => {
          this.currentUser = res
        },
        err => {
          localStorage.user = undefined
          this._router.navigate([''])
        })
  }
}
