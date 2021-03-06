import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ScanPage } from './scan.page'
import { ZXingScannerModule } from '@zxing/ngx-scanner'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ScanPage }]),
    ZXingScannerModule
  ],
  declarations: [ScanPage]
})
export class ScanPageModule {}
