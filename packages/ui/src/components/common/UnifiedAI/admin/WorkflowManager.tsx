"use client";

import { useState } from 'react';

import { Button } from '../../../ui/button';
import type { AIAdminAction } from '../types/admin.types';
import { runAdminAction } from './adminAIService';

export function WorkflowManager() {
  const [actionType, setActionType] = useState('');
  const [payload, setPayload] = useState('{}');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    try {
      const parsed = JSON.parse(payload || '{}') as Record<string, unknown>;
      const action: AIAdminAction = {
        id: `admin-${Date.now()}`,
        type: actionType || 'workflow.run',
        payload: parsed,
      };
      const response = await runAdminAction(action);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao executar workflow');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">Executar workflows administrativos.</div>
      <input
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="Tipo de ação (ex: workflow.run)"
        value={actionType}
        onChange={(event) => setActionType(event.target.value)}
      />
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        rows={4}
        value={payload}
        onChange={(event) => setPayload(event.target.value)}
      />
      {error && <div className="text-sm text-destructive">{error}</div>}
      <Button type="button" loading={isRunning} onClick={handleRun}>
        Executar
      </Button>
      {result && (
        <pre className="rounded-md bg-muted p-3 text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
