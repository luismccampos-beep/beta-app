type ChatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
type ChatTheme = 'full' | 'compact' | 'minimal';
interface ChatInterfaceProps {
    uiConfig?: {
        position?: ChatPosition;
        theme?: ChatTheme;
    };
}
export declare function ChatInterface({ uiConfig }: ChatInterfaceProps): import("react/jsx-runtime").JSX.Element;
export {};
