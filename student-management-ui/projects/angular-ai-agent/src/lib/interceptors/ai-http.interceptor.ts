import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { CapabilityRegistryService } from '../core/capability-registry.service';

export const aiHttpInterceptor: HttpInterceptorFn = (req, next) => {

  const registry = inject(CapabilityRegistryService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let message = '';

      if (error.status === 401) {
        message = 'Unauthorized access';
      } else if (error.status === 403) {
        message = 'Forbidden: insufficient permissions';
      } else if (error.status === 400) {
        message = 'Validation error from server';
      } else {
        message = `API Error (${error.status}): ${error.message}`;
      }

      registry.setExecutionError(message);

      return throwError(() => error);
    })
  );
};