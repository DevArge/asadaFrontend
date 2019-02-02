import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DashboardComponent implements OnInit {

  constructor(private _fuseConfigService: FuseConfigService) { 
    this.ngOnInit();
  }

  ngOnInit() {
    this._fuseConfigService.config = {
      layout: {
          style:'vertical-layout-1',
      }
    };
  }

}
