import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  APP_INITIALIZER
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { CapabilityRegistryService } from '../core/capability-registry.service';
import { installFormHook } from '../hooks/form-hook';
import { installRouterHook } from '../hooks/router-hook';
import { aiHttpInterceptor } from '../interceptors/ai-http.interceptor';

export interface AiAgentConfig {
  roleResolver?: () => {
    isAuthenticated: boolean;
    roles: string[];
    permissions?: string[];
  };
}

export function provideAiAgent(config?: AiAgentConfig): EnvironmentProviders {

  return makeEnvironmentProviders([

    CapabilityRegistryService,

    provideHttpClient(
      withInterceptors([aiHttpInterceptor])
    ),

    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [FormBuilder, Router, CapabilityRegistryService],
      useFactory: (
        fb: FormBuilder,
        router: Router,
        registry: CapabilityRegistryService
      ) => {

        return () => {

          installFormHook(fb, registry);
          installRouterHook(router, registry);

          if (config?.roleResolver) {
            registry.setAuthState(config.roleResolver());
          }

        };
      }
    }

  ]);
}