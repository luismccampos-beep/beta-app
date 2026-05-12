export interface ChatMessageRendererProps {
  message: string;
  role?: 'user' | 'assistant' | 'system';
}

export function ChatMessageRenderer(props: ChatMessageRendererProps) {
  const { message, role = 'assistant' } = props;
  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
          isSystem
            ? 'bg-muted text-muted-foreground'
            : isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {message}
      </div>
    </div>
  );
}
