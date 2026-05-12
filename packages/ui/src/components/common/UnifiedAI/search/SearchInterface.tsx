"use client";

import { useState } from 'react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { SearchResultsRenderer } from './SearchResultsRenderer';
import { useAISearch } from './useAISearch';

export function SearchInterface() {
  const [query, setQuery] = useState('');
  const { results, isLoading, error, search, clear } = useAISearch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void search(query);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <Input
          placeholder="Pesquisar destinos, tours ou experiências"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" loading={isLoading}>
          Buscar
        </Button>
        <Button type="button" variant="ghost" onClick={clear}>
          Limpar
        </Button>
      </form>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <SearchResultsRenderer query={query} results={results} />
    </div>
  );
}
