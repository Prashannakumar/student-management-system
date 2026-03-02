import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CapabilityRegistryService } from './capability-registry.service';

@Injectable({ providedIn: 'root' })
export class ActionExecutorService {

  constructor(
    private router: Router,
    private registry: CapabilityRegistryService
  ) {}

  async navigate(route: string) {
    try {
      await this.router.navigateByUrl(route);
      this.registry.clearExecutionError();
    } catch (error: any) {
      this.registry.setExecutionError(
        'Navigation failed: ' + error.message
      );
    }
  }

  fillForm(payload: any) {
    const form = this.registry.getActiveFormGroup();
    if (!form) return;

    Object.keys(payload).forEach(key => {
      if (form.contains(key)) {
        form.get(key)?.setValue(payload[key]);
      }
    });

    this.registry.clearExecutionError();
  }

  submitForm() {
    const form = this.registry.getActiveFormGroup();
    if (!form) return;

    form.markAllAsTouched();

    if (form.invalid) {
      this.registry.setExecutionError('Form validation failed');
      return;
    }

    try {
      form.updateValueAndValidity();
      this.registry.clearExecutionError();
    } catch (error: any) {
      this.registry.setExecutionError(
        'Submission error: ' + error.message
      );
    }
  }
}