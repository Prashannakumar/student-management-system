import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActionRegistryService } from '../services/action-registry.service';
import { AI_ACTIONS_HOLDER } from '../decorators/ai-action.decorator';

@Component({
    template: ''
})
export abstract class AiEnabledComponent implements OnInit, OnDestroy {
    protected actionRegistry = inject(ActionRegistryService);

    ngOnInit(): void {
        this.registerDecoratedActions();
    }

    ngOnDestroy(): void {
        this.actionRegistry.unregisterActions(this);
    }

    private registerDecoratedActions(): void {
        const prototype = Object.getPrototypeOf(this);
        const actionsMap: Map<string, any> = prototype[AI_ACTIONS_HOLDER];

        if (actionsMap) {
            actionsMap.forEach((metadata, id) => {
                this.actionRegistry.registerAction(metadata, this, metadata.methodName);
            });
        }
    }
}
