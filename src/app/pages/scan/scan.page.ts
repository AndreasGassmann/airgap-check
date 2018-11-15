import { Component, OnInit, ViewChild } from '@angular/core'
import { Platform } from '@ionic/angular'
import { NavigationStart, Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { ZXingScannerComponent } from '@zxing/ngx-scanner'
import { SchemeRoutingService } from '../../services/scheme-routing'

declare var QRScanner: any

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage implements OnInit {
  @ViewChild('scanner')
  public zxingScanner: ZXingScannerComponent

  public availableDevices: MediaDeviceInfo[]
  public selectedDevice: MediaDeviceInfo
  public scannerEnabled = true

  public isBrowser = false
  public hasCameras = false

  private routeSub?: Subscription // subscription to route observer

  constructor(
    private platform: Platform,
    private router: Router,
    private schemeRoutingProvider: SchemeRoutingService
  ) {
    this.isBrowser = !this.platform.is('cordova')
  }

  async ngOnInit() {
    this.routeSub = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.stop()
      }
    })

    if (this.platform.is('cordova')) {
      QRScanner.scan(this.displayContents.bind(this))
      QRScanner.show()
    } else {
      this.zxingScanner.camerasNotFound.subscribe(
        (devices: MediaDeviceInfo[]) => {
          console.error(
            'An error has occurred when trying to enumerate your video-stream-enabled devices.'
          )
        }
      )
      if (this.selectedDevice) {
        // Not the first time that we open scanner
        this.zxingScanner.startScan(this.selectedDevice)
      }
      this.zxingScanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        this.hasCameras = true
        this.availableDevices = devices
        this.selectedDevice = devices[0]
      })
    }
  }

  private async displayContents(err: any, text: string) {
    if (this.platform.is('cordova')) {
      if (err) {
        // an error occurred, or the scan was canceled (error code `6`)
        console.error('qr callback', err)
      } else {
        // The scan completed, display the contents of the QR code
        alert(text)
      }
    } else {
      await this.schemeRoutingProvider.handleNewSyncRequest(err)
      await this.router.navigate(['/scan-detail/1'])
    }
  }

  stop() {
    if (this.platform.is('cordova')) {
      QRScanner.destroy((status: any) => {
        console.log(status)
      })
    } else {
      this.zxingScanner.resetCodeReader()
    }
  }

  public ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe()
    }
  }
}
