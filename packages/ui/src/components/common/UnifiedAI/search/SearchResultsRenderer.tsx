export interface SearchResultsRendererProps {
  query?: string;
  results?: {
    suggestions: Array<{
      id: string;
      title: string;
      description?: string;
      category?: string;
      country?: string;
      tags?: string[];
      popularity?: number;
      imageUrl?: string;
    }>;
    popularDestinations?: unknown[];
    total: number;
    hasMore: boolean;
  } | null;
}

export function SearchResultsRenderer(props: SearchResultsRendererProps) {
  const { query, results } = props;

  if (!query) {
    return <div className="text-sm text-muted-foreground">Introduza um termo para pesquisar.</div>;
  }

  if (!results) {
    return <div className="text-sm text-muted-foreground">Aguardando resultados.</div>;
  }

  if (!results.suggestions.length) {
    return <div className="text-sm text-muted-foreground">Nenhum resultado encontrado.</div>;
  }

  return (
    <div className="space-y-2">
      {results.suggestions.map((item) => (
        <div key={item.id} className="rounded-md border border-border p-3">
          <div className="font-medium">{item.title}</div>
          {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {item.category && <span>{item.category}</span>}
            {item.country && <span>{item.country}</span>}
            {item.tags?.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
