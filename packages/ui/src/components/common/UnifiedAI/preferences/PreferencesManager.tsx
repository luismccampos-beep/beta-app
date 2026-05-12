"use client";

import { useEffect, useState } from 'react';

import type { AIPreferences } from '../types/preferences.types';
import { PreferencesForm } from './PreferencesForm';
import { useAIPreferences } from './useAIPreferences';

export function PreferencesManager() {
  const { data, isLoading, error, save, reset } = useAIPreferences();
  const [rawValue, setRawValue] = useState<string>('{}');
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setRawValue(JSON.stringify(data ?? {}, null, 2));
  }, [data]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(rawValue) as AIPreferences;
      setParseError(null);
      await save(parsed);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'JSON inválido');
    }
  };

  const handleReset = async () => {
    await reset();
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">Preferências em formato JSON.</div>
      <PreferencesForm
        value={rawValue}
        onChange={setRawValue}
        onSave={handleSave}
        onReset={handleReset}
        isLoading={isLoading}
        error={parseError ?? error}
      />
    </div>
  );
}
