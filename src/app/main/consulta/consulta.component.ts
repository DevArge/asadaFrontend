import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations/index';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ConsultaComponent implements OnInit {

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
