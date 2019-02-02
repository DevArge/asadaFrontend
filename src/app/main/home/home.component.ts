import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class HomeComponent implements OnInit {

  constructor(private _fuseConfigService: FuseConfigService) { 
    this._fuseConfigService.config = {
      layout: {
          style:'vertical-layout-2',
      }
    };

  }

  ngOnInit() {

  }

}
