import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import {HttpClientModule} from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ShareService } from './share.service'
import { AuthService } from './auth.service'
import { ChatService } from './chat.service';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { LandComponent } from './land/land.component';
import { UserComponent } from './user/user.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
  {
    path: '',
    component: SignupComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'land',
    component: LandComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignupComponent,
    HomeComponent,
    LandComponent,
    UserComponent,
    WalletComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ ShareService, ChatService, AuthService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
