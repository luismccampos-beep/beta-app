"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@akmleva/ui';
import { cn } from '../../../utils/cn';
export const ImageGallery = ({ images, video, packageName, }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showVideo, setShowVideo] = useState(false);
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    return (_jsxs("div", { className: 'relative', children: [_jsxs("div", { className: 'aspect-video rounded-xl overflow-hidden bg-gray-100', children: [showVideo && video ? (_jsx("iframe", { src: video, className: 'w-full h-full', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture', allowFullScreen: true, title: `Video for ${packageName}` })) : (_jsx("img", { 
                        // eslint-disable-next-line security/detect-object-injection
                        src: images[currentImageIndex], alt: `${packageName} - ${currentImageIndex + 1}`, className: 'w-full h-full object-cover' })), images.length > 1 && !showVideo && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: 'ghost', size: 'icon', className: 'absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white', onClick: prevImage, children: _jsx(ChevronLeft, { className: 'h-6 w-6' }) }), _jsx(Button, { variant: 'ghost', size: 'icon', className: 'absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white', onClick: nextImage, children: _jsx(ChevronRight, { className: 'h-6 w-6' }) })] })), video && !showVideo && (_jsx(Button, { variant: 'ghost', size: 'icon', className: 'absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white', onClick: () => setShowVideo(true), children: _jsx(PlayCircle, { className: 'h-8 w-8' }) }))] }), images.length > 1 && (_jsx("div", { className: 'flex mt-4 gap-2 overflow-x-auto', children: images.map((image, index) => (_jsx("button", { className: cn('flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2', currentImageIndex === index ? 'border-primary' : 'border-transparent'), onClick: () => {
                        setCurrentImageIndex(index);
                        setShowVideo(false);
                    }, children: _jsx("img", { src: image, alt: `Thumbnail ${index + 1}`, className: 'w-full h-full object-cover' }) }, index))) }))] }));
};
/** @alias */
export default ImageGallery;
//# sourceMappingURL=ImageGallery.js.map