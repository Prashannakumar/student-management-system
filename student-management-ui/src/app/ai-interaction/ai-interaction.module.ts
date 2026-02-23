import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionRegistryService } from './services/action-registry.service';
import { FormRegistryService } from './services/form-registry.service';
import { ContextBuilderService } from './services/context-builder.service';
import { AiClientService } from './services/ai-client.service';
import { ActionDispatcherService } from './services/action-dispatcher.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [
        ActionRegistryService,
        FormRegistryService,
        ContextBuilderService,
        AiClientService,
        ActionDispatcherService
    ],
    exports: []
})
export class AiInteractionModule { }
