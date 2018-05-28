import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { ShareService } from './share.service'

@Injectable()
export class AuthService {

  constructor(private _share: ShareService, private _http: HttpClient, private _router: Router) { }
  
  baseUrl  = this._share.baseUri

  loggedIn = false

  login(body){
    return this._http.post(this.baseUrl + 'api/user/signin', body)
  }
  
  signUp(body){
    return this._http.post(this.baseUrl + 'api/user/signup', body)
  }
  
  getCurrentUser(){
    var headers = new HttpHeaders().set('Authorization', localStorage.Authorization)
    return this._http.post(this.baseUrl + 'api/user/getUser', {}, {headers: headers})
  }


  logOut(){
    localStorage.Authorization = undefined
    this.loggedIn = false
    this._router.navigate([''])
  }

  setIsLogged(state) {
    this.loggedIn = state
  }

  isLoggedIn() {
    return this.loggedIn
  }
}
