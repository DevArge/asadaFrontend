import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatToolbarModule, MatProgressSpinnerModule, MatSidenavModule, MatGridListModule, MatTableModule, MatSelectModule, MatChipsModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { APP_ROUTES } from './app.routes';
//componentes
import { HomeComponent } from './main/home/home.component';
import { LoginComponent } from './main/login/login.component';
import { ConsultaComponent } from './main/consulta/consulta.component';
import { AuthInterceptorHttpService } from './services/AuthInterceptor-http.service';
import {SlideshowModule} from 'intouch-screensaver';
import { FooterComponent } from './main/layout/footer/footer.component';
import { PipeModule } from './pipes/pipe.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ConsultaComponent,
        FooterComponent, 
    ],
    imports     : [
        PipeModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        APP_ROUTES,
        SlideshowModule,
        MatSidenavModule,
        MatGridListModule,
        MatTableModule,
        MatSelectModule,
        MatChipsModule,
        ScrollToModule.forRoot(),
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
    ],
    bootstrap   : [
        AppComponent
    ],
    providers:[
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorHttpService,
            multi: true
        }
    ]
})
export class AppModule
{
}
