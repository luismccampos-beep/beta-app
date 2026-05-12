import { Button } from '../../../ui/button';

export interface PreferencesFormProps {
  formId?: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function PreferencesForm(props: PreferencesFormProps) {
  const { formId, value, onChange, onSave, onReset, isLoading, error } = props;

  return (
    <form id={formId} className="space-y-3" onSubmit={(event) => {
      event.preventDefault();
      onSave();
    }}>
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        rows={6}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <div className="text-sm text-destructive">{error}</div>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" loading={Boolean(isLoading)}>
          Guardar preferências
        </Button>
        <Button type="button" variant="ghost" onClick={onReset}>
          Repor
        </Button>
      </div>
    </form>
  );
}
