import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createPortal } from 'react-dom';
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return createPortal(_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: _jsxs("div", { className: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0", children: [_jsx("div", { className: "fixed inset-0 transition-opacity", "aria-hidden": "true", onClick: onClose, children: _jsx("div", { className: "absolute inset-0 bg-gray-500 opacity-75" }) }), _jsx("span", { className: "hidden sm:inline-block sm:align-middle sm:h-screen", "aria-hidden": "true", children: "\u200B" }), _jsxs("div", { className: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full", children: [title && (_jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: _jsx("h3", { className: "text-lg font-medium leading-6 text-gray-900", id: "modal-title", children: title }) })), _jsx("div", { className: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4", children: children }), _jsx("div", { className: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse", children: _jsx("button", { type: "button", className: "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm", onClick: onClose, children: "Close" }) })] })] }) }), document.body);
};
export { Modal };
export default Modal;
//# sourceMappingURL=Modal.js.map