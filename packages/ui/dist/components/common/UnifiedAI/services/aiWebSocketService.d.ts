export interface AIWebSocketConnection {
    send: (data: string) => void;
    close: () => void;
}
export declare function createAIWebSocketConnection(): AIWebSocketConnection;
