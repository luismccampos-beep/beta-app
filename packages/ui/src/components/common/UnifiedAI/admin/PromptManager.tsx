"use client";

import { useState } from 'react';

import { Button } from '../../../ui/button';
import type { AIAdminAction } from '../types/admin.types';
import { runAdminAction } from './adminAIService';

export function PromptManager() {
  const [actionType, setActionType] = useState('prompt.update');
  const [prompt, setPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!prompt.trim()) {
      setError('Prompt vazio');
      return;
    }
    setIsSaving(true);
    setError(null);
    setResult(null);
    try {
      const action: AIAdminAction = {
        id: `prompt-${Date.now()}`,
        type: actionType,
        payload: { prompt: prompt.trim() },
      };
      const response = await runAdminAction(action);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar prompt');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">Gestão de prompts e instruções.</div>
      <input
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={actionType}
        onChange={(event) => setActionType(event.target.value)}
        placeholder="Tipo de ação"
      />
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        rows={6}
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Atualize o prompt do assistente"
      />
      {error && <div className="text-sm text-destructive">{error}</div>}
      <Button type="button" loading={isSaving} onClick={handleSave}>
        Guardar prompt
      </Button>
      {result && (
        <pre className="rounded-md bg-muted p-3 text-xs overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
