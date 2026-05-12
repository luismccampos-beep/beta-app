export interface AIWebSocketConnection {
  send: (data: string) => void;
  close: () => void;
}

export function createAIWebSocketConnection(): AIWebSocketConnection {
  return {
    send: () => {},
    close: () => {},
  };
}
