export function parseAIResponse(content) {
    return {
        id: 'parsed',
        role: 'assistant',
        content,
        createdAt: Date.now(),
    };
}
//# sourceMappingURL=aiResponseParser.js.map