import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
const AutoSizer = ({ children, className, style }) => {
    const ref = useRef(null);
    const [size, setSize] = useState({ height: 0, width: 0 });
    useEffect(() => {
        const element = ref.current;
        if (!element)
            return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
            }
        });
        resizeObserver.observe(element);
        // Initial size
        const rect = element.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
        return () => {
            resizeObserver.disconnect();
        };
    }, []);
    return (_jsx("div", { ref: ref, className: className, style: { width: '100%', height: '100%', ...style }, children: size.height > 0 && size.width > 0 && children(size) }));
};
export default AutoSizer;
//# sourceMappingURL=AutoSizer.js.map