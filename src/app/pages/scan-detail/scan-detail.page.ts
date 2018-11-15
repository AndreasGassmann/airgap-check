import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-scan-detail',
  templateUrl: './scan-detail.page.html',
  styleUrls: ['./scan-detail.page.scss']
})
export class ScanDetailPage implements OnInit {
  scanID: string
  content: string

  constructor(route: ActivatedRoute) {
    this.scanID = route.snapshot.params['id']
    this.content = JSON.stringify(
      JSON.parse(localStorage.getItem(this.scanID)),
      null,
      4
    )
  }

  ngOnInit() {}
}
