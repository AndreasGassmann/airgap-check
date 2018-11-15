import { Injectable } from '@angular/core'
import {
  DeserializedSyncProtocol,
  UnsignedTransaction,
  SyncProtocolUtils,
  EncodedType
} from 'airgap-coin-lib'
import { AlertController } from '@ionic/angular'
import { AlertButton } from '@ionic/core'

@Injectable()
export class SchemeRoutingService {
  private syncSchemeHandlers: {
    [key in EncodedType]: (
      deserializedSync: DeserializedSyncProtocol,
      scanAgainCallback: Function
    ) => Promise<boolean>
  }

  constructor(private alertController: AlertController) {
    this.syncSchemeHandlers = {
      [EncodedType.WALLET_SYNC]: this.syncSchemeDetected.bind(this),
      [EncodedType.UNSIGNED_TRANSACTION]: this.syncSchemeDetected.bind(this),
      [EncodedType.SIGNED_TRANSACTION]: this.syncSchemeDetected.bind(this)
    }
  }

  async handleNewSyncRequest(
    rawString: string,
    scanAgainCallback: Function = () => {
      /* */
    }
  ) {
    const syncProtocol = new SyncProtocolUtils()

    console.log('got new url', rawString)

    let url = new URL(rawString)
    let d = url.searchParams.get('d')

    if (d.length === 0) {
      d = rawString // Fallback to support raw data QRs
    }

    try {
      const deserializedSync = await syncProtocol.deserialize(d)

      if (deserializedSync.type in EncodedType) {
        // Only handle types that we know
        return this.syncSchemeHandlers[deserializedSync.type](
          deserializedSync,
          scanAgainCallback
        )
      } else {
        return this.syncSchemeDetected(deserializedSync, scanAgainCallback)
      }
    } catch (e) {
      console.error('Deserialization of sync failed', e)
    }
  }

  private async syncSchemeDetected(
    deserializedSyncProtocol: DeserializedSyncProtocol,
    scanAgainCallback: Function
  ) {
    localStorage.setItem('1', JSON.stringify(deserializedSyncProtocol))

    const cancelButton = {
      text: 'Okay!',
      role: 'cancel',
      handler: () => {
        scanAgainCallback()
      }
    }
    this.showAlert('Success', 'Sync scheme detected', [cancelButton])
  }

  async showAlert(header: string, message: string, buttons: AlertButton[]) {
    let alert = await this.alertController.create({
      header,
      message,
      backdropDismiss: false,
      buttons
    })
    await alert.present()
  }
}
