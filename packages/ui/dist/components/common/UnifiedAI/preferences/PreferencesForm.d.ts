export interface PreferencesFormProps {
    formId?: string;
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    onReset: () => void;
    isLoading?: boolean;
    error?: string | null;
}
export declare function PreferencesForm(props: PreferencesFormProps): import("react/jsx-runtime").JSX.Element;
