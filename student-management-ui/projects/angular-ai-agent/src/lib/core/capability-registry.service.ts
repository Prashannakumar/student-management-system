import { Injectable } from '@angular/core';

export interface RouteCapability {
  path: string;
  guarded: boolean;
}

export interface FieldCapability {
  id: string;
  type: string;
  required: boolean;
}

export interface FormCapability {
  route: string;
  fields: FieldCapability[];
  valid?: boolean;
  errors?: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  roles: string[];
}

export interface ApplicationCapabilities {
  routes: RouteCapability[];
  forms: FormCapability[];
  auth: AuthState;
}

export interface RuntimeState {
  currentRoute: string | null;
  activeForm: FormCapability | null;
  lastExecutionError?: string;
}

@Injectable({ providedIn: 'root' })
export class CapabilityRegistryService {

  private application: ApplicationCapabilities = {
    routes: [],
    forms: [],
    auth: {
      isAuthenticated: false,
      roles: []
    }
  };

  private runtime: RuntimeState = {
    currentRoute: null,
    activeForm: null
  };

  // ---------------- ROUTES ----------------

  registerRoute(route: RouteCapability) {
    if (!this.application.routes.find(r => r.path === route.path)) {
      this.application.routes.push(route);
    }
  }

  setCurrentRoute(path: string) {
    this.runtime.currentRoute = path;
  }

  // ---------------- FORMS ----------------

  registerForm(form: FormCapability) {
    const index = this.application.forms.findIndex(f => f.route === form.route);

    if (index >= 0) {
      this.application.forms[index] = form;
    } else {
      this.application.forms.push(form);
    }

    this.runtime.activeForm = form;
  }

  clearActiveForm() {
    this.runtime.activeForm = null;
  }

  // ---------------- AUTH ----------------

  setAuthState(auth: AuthState) {
    this.application.auth = auth;
  }

  // ---------------- EXECUTION FEEDBACK ----------------

  setExecutionError(message: string) {
    this.runtime.lastExecutionError = message;
  }

  clearExecutionError() {
    this.runtime.lastExecutionError = undefined;
  }

  // ---------------- SNAPSHOT ----------------

  buildContextSnapshot() {
    return {
      application: this.application,
      runtime: this.runtime
    };
  }

  private activeFormGroup: any = null;

setActiveFormGroup(form: any) {
  this.activeFormGroup = form;
}

getActiveFormGroup() {
  return this.activeFormGroup;
}
}