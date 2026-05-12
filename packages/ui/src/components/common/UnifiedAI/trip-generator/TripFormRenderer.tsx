"use client";

import { useMemo, useState } from 'react';

import { Button } from '../../../Button';
import { Input } from '../../../Input';
import type { TripPreferences } from './tripGeneratorService';

export interface TripFormRendererProps {
  formId?: string;
  onSubmit?: (preferences: TripPreferences) => void;
}

const defaultPreferences: TripPreferences = {
  name: '',
  email: '',
  budget: 1500,
  duration: 5,
  interests: [],
  sustainability: 3,
  travelers: 2,
  destination: '',
  additionalComments: '',
};

export function TripFormRenderer(props: TripFormRendererProps) {
  const { formId, onSubmit } = props;
  const [formState, setFormState] = useState<TripPreferences>(defaultPreferences);

  const isValid = useMemo(() => formState.budget > 0 && formState.duration > 0 && formState.travelers > 0, [formState]);

  const handleChange = <K extends keyof TripPreferences>(key: K, value: TripPreferences[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    onSubmit?.(formState);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          placeholder="Nome"
          value={formState.name ?? ''}
          onChange={(event) => handleChange('name', event.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={formState.email ?? ''}
          onChange={(event) => handleChange('email', event.target.value)}
        />
        <Input
          placeholder="Destino desejado"
          value={formState.destination ?? ''}
          onChange={(event) => handleChange('destination', event.target.value)}
        />
        <Input
          placeholder="Interesses (separados por vírgula)"
          value={formState.interests.join(', ')}
          onChange={(event) => handleChange('interests', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
        />
        <Input
          placeholder="Orçamento"
          type="number"
          min={0}
          value={formState.budget}
          onChange={(event) => handleChange('budget', Number(event.target.value))}
        />
        <Input
          placeholder="Duração (dias)"
          type="number"
          min={1}
          value={formState.duration}
          onChange={(event) => handleChange('duration', Number(event.target.value))}
        />
        <Input
          placeholder="Viajantes"
          type="number"
          min={1}
          value={formState.travelers}
          onChange={(event) => handleChange('travelers', Number(event.target.value))}
        />
        <Input
          placeholder="Sustentabilidade (1-5)"
          type="number"
          min={1}
          max={5}
          value={formState.sustainability}
          onChange={(event) => handleChange('sustainability', Number(event.target.value))}
        />
      </div>
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        rows={3}
        placeholder="Comentários adicionais"
        value={formState.additionalComments ?? ''}
        onChange={(event) => handleChange('additionalComments', event.target.value)}
      />
      <Button type="submit" disabled={!isValid}>
        Gerar viagem
      </Button>
    </form>
  );
}
