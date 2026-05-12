"use client";


import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@akmleva/ui';

import { cn } from '../../../utils/cn';

interface ImageGalleryProps {
  images: string[];
  video?: string;
  packageName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  video,
  packageName,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className='relative'>
      <div className='aspect-video rounded-xl overflow-hidden bg-gray-100'>
        {showVideo && video ? (
          <iframe
            src={video}
            className='w-full h-full'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            title={`Video for ${packageName}`}
          />
        ) : (
          <img
            // eslint-disable-next-line security/detect-object-injection
            src={images[currentImageIndex]}
            alt={`${packageName} - ${currentImageIndex + 1}`}
            className='w-full h-full object-cover'
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && !showVideo && (
          <>
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white'
              onClick={prevImage}
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white'
              onClick={nextImage}
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
          </>
        )}

        {/* Video Play Button */}
        {video && !showVideo && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white'
            onClick={() => setShowVideo(true)}
          >
            <PlayCircle className='h-8 w-8' />
          </Button>
        )}
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className='flex mt-4 gap-2 overflow-x-auto'>
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2',
                currentImageIndex === index ? 'border-primary' : 'border-transparent'
              )}
              onClick={() => {
                setCurrentImageIndex(index);
                setShowVideo(false);
              }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/** @alias */
export default ImageGallery;
