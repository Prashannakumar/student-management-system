import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormRegistryService {
    private forms = new Map<string, FormGroup>();

    /**
     * Register a reactive form.
     * @param name Unique name for the form (e.g., 'student-form')
     * @param form The FormGroup instance
     */
    registerForm(name: string, form: FormGroup): void {
        this.forms.set(name, form);
    }

    /**
     * Unregister a form.
     */
    unregisterForm(name: string): void {
        this.forms.delete(name);
    }

    /**
     * Get a registered form.
     */
    getForm(name: string): FormGroup | undefined {
        return this.forms.get(name);
    }

    /**
     * Get all registered form names.
     */
    getRegisteredFormNames(): string[] {
        return Array.from(this.forms.keys());
    }

    /**
     * Safely fill a form with data.
     * Supports nested structures.
     * @param formName The name of the form
     * @param data The data to patch into the form
     */
    fillForm(formName: string, data: any): void {
        const form = this.getForm(formName);
        if (form) {
            form.patchValue(data);
        } else {
            console.error(`Form "${formName}" not found in registry.`);
        }
    }
}
