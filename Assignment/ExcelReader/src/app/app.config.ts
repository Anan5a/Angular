import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { injectAuthorizationHeaderInterceptor } from './services/auth.guards';
import { provideToastr } from 'ngx-toastr';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { GoogleClientId } from '../constants';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always'
      })
    ),
    provideHttpClient(
      withInterceptors([injectAuthorizationHeaderInterceptor])
    ),
    provideAnimationsAsync(),
    provideToastr(),
    //// social login ////
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              GoogleClientId
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
