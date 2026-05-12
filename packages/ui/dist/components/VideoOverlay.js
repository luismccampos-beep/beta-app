import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { cn } from "../utils/cn";
export const VideoOverlay = ({ overlay, overlayColor, overlayOpacity, poster, isLoading, hasError, contentClassName, children, }) => {
    const showPoster = (isLoading || hasError) && poster;
    return (_jsxs(_Fragment, { children: [showPoster && (_jsx("div", { className: cn("absolute inset-0 bg-cover bg-center z-10", isLoading && "animate-pulse"), style: { backgroundImage: `url(${poster})` }, role: "img", "aria-label": hasError ? "Imagem de fundo alternativa" : "Carregando vídeo" })), overlay && (_jsx("div", { className: "absolute inset-0 pointer-events-none z-10", style: { backgroundColor: overlayColor, opacity: overlayOpacity }, "aria-hidden": "true" })), children && (_jsx("div", { className: cn("relative z-20", contentClassName), children: children }))] }));
};
//# sourceMappingURL=VideoOverlay.js.map