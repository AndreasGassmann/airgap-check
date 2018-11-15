import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

declare var QRScanner: any;

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage implements OnInit {
  private routeSub?: Subscription; // subscription to route observer

  constructor(private platform: Platform, private router: Router) {}

  async ngOnInit() {
    if (this.platform.is('cordova')) {
      this.routeSub = this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          this.stop();
        }
      });

      QRScanner.scan(this.displayContents.bind(this));
      QRScanner.show();
    } else {
      console.log('Not cordova');
    }
  }

  private async displayContents(err: any, text: string) {
    if (err) {
      // an error occurred, or the scan was canceled (error code `6`)
      console.error('qr callback', err);
    } else {
      // The scan completed, display the contents of the QR code
      alert(text);
    }
  }

  stop() {
    // TODO: Call this when navigating away
    QRScanner.destroy((status: any) => {
      console.log(status);
    });
  }

  public ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
