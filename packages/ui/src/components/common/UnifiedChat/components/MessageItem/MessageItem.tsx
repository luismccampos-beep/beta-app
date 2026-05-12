import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '../../../../../utils';
import type { ChatMessageItemProps } from '../../UnifiedChat.types';
import { formatMessageTime, shouldShowAvatar } from '../../utils/index';
import { StatusIndicator } from '../StatusIndicator/StatusIndicator';

const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt }: { src?: string, alt?: string }) => (
  src ? <img src={src} alt={alt} className="aspect-square h-full w-full" /> : null
);

const AvatarFallback = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}>
    {children}
  </div>
);

export const MessageItem = React.memo<ChatMessageItemProps>(
  ({ message, previousMessage, sessionUser }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const senderAvatar = sessionUser?.image;
    const fallbackAvatar = isUser ? sessionUser?.name?.charAt(0) || 'U' : 'AK';
    const showAvatar = shouldShowAvatar(message, previousMessage);

    if (isSystem) {
      return (
        <div className="flex justify-center mb-2 animate-in fade-in-up duration-300">
          <div className="bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-gray-500 dark:text-gray-400 border border-slate-300 dark:border-slate-700 rounded-xl text-center text-[13px] italic px-3 py-2 max-w-[80%] mx-auto shadow-sm">
            <div className="opacity-80 leading-tight">{message.content}</div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn(
        "flex gap-2.5 mb-4 animate-in fade-in-up duration-300",
        isUser ? "justify-end" : "justify-start"
      )}>
        {!isUser && (
          <Avatar className={cn("w-7 h-7 self-end border-2 border-white/50", !showAvatar ? 'invisible' : '')}>
            {senderAvatar ? <AvatarImage src={senderAvatar} alt="Avatar do suporte" /> : null}
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold flex items-center justify-center">{fallbackAvatar}</AvatarFallback>
          </Avatar>
        )}
        <div className={cn(
          "max-w-[70%] md:max-w-[65%] p-3 rounded-2xl shadow-sm overflow-wrap-break-word relative",
          isUser 
            ? "bg-[#0088fe] text-white rounded-br-none" 
            : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-bl-none"
        )}>
          <div className="text-[13px] md:text-sm break-words leading-relaxed markdown-content">
            {message.type === 'markdown' || !isUser ? (
                <Markdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
                        a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{children}</a>,
                        code: ({children}) => <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-xs">{children}</code>,
                        pre: ({children}) => <pre className="bg-black/10 dark:bg-white/10 p-2 rounded-lg overflow-x-auto my-2 text-xs font-mono">{children}</pre>,
                        ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                    }}
                >
                    {message.content}
                </Markdown>
            ) : (
                <span className="whitespace-pre-wrap">{message.content}</span>
            )}
          </div>
          <p className={cn(
            "text-[10px] mt-1.5 opacity-70",
            isUser ? "text-right" : "text-left"
          )}>
            {formatMessageTime(message.timestamp)}
          </p>
          {isUser && message.status && <StatusIndicator status={message.status} />}
        </div>
        {isUser && (
          <Avatar className={cn("w-7 h-7 self-end border-2 border-white/50", !showAvatar ? 'invisible' : '')}>
            {senderAvatar ? <AvatarImage src={senderAvatar} alt="Avatar do usuário" /> : null}
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold flex items-center justify-center">{fallbackAvatar}</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.message.id === next.message.id &&
      prev.message.content === next.message.content &&
      prev.message.status === next.message.status &&
      prev.previousMessage?.id === next.previousMessage?.id &&
      prev.sessionUser?.image === next.sessionUser?.image
    );
  }
);
MessageItem.displayName = 'MessageItem';
