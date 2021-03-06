import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import { ZXingScannerModule } from '@zxing/ngx-scanner'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { SchemeRoutingService } from './services/scheme-routing'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ZXingScannerModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SchemeRoutingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
