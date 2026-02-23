import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AiContextService {

    private activeFormMetadata: any[] = [];

    setActiveForm(metadata: any[]) {
        this.activeFormMetadata = metadata;
    }

    getActiveForm() {
        return this.activeFormMetadata;
    }

    clearActiveForm() {
        this.activeFormMetadata = [];
    }

    private activeFormGroup: any;

    setActiveFormGroup(form: any) {
        this.activeFormGroup = form;
    }

    getActiveFormGroup() {
        return this.activeFormGroup;
    }
}