"use client";

import { PromptManager } from './PromptManager';
import { WorkflowManager } from './WorkflowManager';

export function AIAdminInterface() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold">Gestão de Prompts</div>
        <PromptManager />
      </div>
      <div>
        <div className="text-lg font-semibold">Workflows</div>
        <WorkflowManager />
      </div>
    </div>
  );
}
