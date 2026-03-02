import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CapabilityRegistryService } from '../core/capability-registry.service';

export function installRouterHook(
  router: Router,
  registry: CapabilityRegistryService
) {

  // Extract all configured routes once
  router.config.forEach(route => {
    if (route.path) {
      registry.registerRoute({
        path: '/' + route.path,
        guarded: !!route.canActivate?.length
      });
    }
  });

  // Track current route at runtime
  router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      registry.setCurrentRoute(event.urlAfterRedirects);
      registry.clearActiveForm();
    });
}