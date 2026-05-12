import type { AISuggestion } from '../types/ai.types';
import { Button } from '../../../ui/button';

export interface SuggestionsRendererProps {
  suggestions: AISuggestion[];
  isLoading?: boolean;
  error?: string | null;
  onSelect?: ((suggestion: AISuggestion) => void) | undefined;
}

export function SuggestionsRenderer(props: SuggestionsRendererProps) {
  const { suggestions, isLoading, error, onSelect } = props;

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-8 w-24 rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  if (!suggestions.length) {
    return <div className="text-sm text-muted-foreground">Sem sugestões disponíveis.</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onSelect?.(suggestion)}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  );
}
