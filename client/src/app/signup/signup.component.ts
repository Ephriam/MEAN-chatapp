import { Component, OnInit, animate } from '@angular/core';
import { AuthService } from '../auth.service'
import { ChatService } from '../chat.service'
import { transition } from '@angular/core/src/animation/dsl';
import { style, trigger, query } from '@angular/animations'
import { Router } from '@angular/router'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  user = {}
  signUpVar = true;
  err = {
    passwordError: null,
    documentConflict: null,
    invalidCredntial: null
  }
  signUpForm: FormGroup;
  signInForm: FormGroup;
  constructor(private fb: FormBuilder, private _auth: AuthService, private _chat: ChatService, private _router: Router) { 
    this.signUpForm = fb.group({
      'name': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.minLength(3), Validators.required])],
      'confirmPassword': [null, Validators.required]
    })
    this.signInForm = fb.group({
      'email': [null, Validators.email],
      'password': [null, Validators.required]
    })
  }

  ngOnInit() {
    if(this._auth.isLoggedIn()){
      return this._router.navigate(['land'])
    }

  }

  signUp(form) {
   if(form.password != form.confirmPassword){
     this.err.passwordError = "Password Doesn't match"
     return
   }
   this.err.passwordError = null
   this._auth.signUp(form)
       .subscribe((res) =>{
        this.signUpVar = false
        this.user = undefined
       },(err) => {
         if(err.status == 409) {
            this.err.documentConflict = " "
            setTimeout(() => {
              this.err.documentConflict = null
            }, 5000)
         }
       })
  }

  toggleSignUpVar() {
    this.signUpVar = !this.signUpVar
    this.user = {}
  }

  signIn(form) {
    this._auth.login(form)
      .subscribe((res: any) => {
        localStorage.Authorization = res.token
        localStorage.user = res.user
        this._auth.setIsLogged(true)
        this._chat.initChat()
        this._chat.socket.emit('Auth', {Authorization: localStorage.Authorization})
        this._router.navigate(['home'])
      }, (err) => {
        if(err.status == 403) {
           this.err.invalidCredntial = " "
           setTimeout(() => {
             this.err.invalidCredntial = null
           }, 5000)
        }
      })
  }
  change() {
    console.log('touched')
  }
}
