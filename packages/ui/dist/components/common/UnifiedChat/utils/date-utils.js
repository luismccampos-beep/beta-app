export const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};
export const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date).replace(',', '');
};
//# sourceMappingURL=date-utils.js.map