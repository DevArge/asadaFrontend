import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations/index';
import { IImage } from 'intouch-screensaver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})

export class HomeComponent implements OnInit {

  imageUrls: (string | IImage)[] = [
    { url: 'assets/images/slider/1.jpg', type: 'image' },
    { url: 'assets/images/slider/2.jpg', type: 'image' },
    { url: 'assets/images/slider/3.jpg', type: 'image' },
    // { url: 'assets/redbull.mp4', type: 'video' }
  ];

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
