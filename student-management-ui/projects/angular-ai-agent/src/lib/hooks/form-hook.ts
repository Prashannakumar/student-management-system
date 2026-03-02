import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CapabilityRegistryService } from '../core/capability-registry.service';

export function installFormHook(
  fb: FormBuilder,
  registry: CapabilityRegistryService
) {

  const originalGroup = fb.group.bind(fb);

  fb.group = ((controls: any, options?: any): FormGroup => {

    const form = originalGroup(controls, options);

    const fields = Object.keys(form.controls).map(key => {
      const control = form.get(key);

      return {
        id: key,
        type: typeof control?.value,
        required: control?.hasValidator?.(Validators.required) || false
      };
    });

    const route =
      registry.buildContextSnapshot().runtime.currentRoute ?? 'unknown';

    registry.registerForm({
      route,
      fields,
      valid: form.valid,
      errors: form.errors
    });

    registry.setActiveFormGroup(form);

    form.statusChanges.subscribe(() => {
      registry.registerForm({
        route,
        fields,
        valid: form.valid,
        errors: form.errors
      });
    });

    return form;

  }) as typeof fb.group;
}