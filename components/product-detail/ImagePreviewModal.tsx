'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

interface ImagePreviewModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  alt?: string;
}

export default function ImagePreviewModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  alt = 'Gallery image',
}: ImagePreviewModalProps) {
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [rotate, setRotate] = React.useState(0);
  const [flipX, setFlipX] = React.useState(false);
  const [flipY, setFlipY] = React.useState(false);
  const imageRef = React.useRef<HTMLDivElement>(null);

  // Reset all transforms when modal opens/closes or image changes
  React.useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotate(0);
    setFlipX(false);
    setFlipY(false);
  }, [isOpen, currentIndex]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scroll when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handlePrevious = React.useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onIndexChange(newIndex);
  }, [currentIndex, images.length, onIndexChange]);

  const handleNext = React.useCallback(() => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onIndexChange(newIndex);
  }, [currentIndex, images.length, onIndexChange]);

  const handleZoomIn = React.useCallback(() => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  }, []);

  const handleZoomOut = React.useCallback(() => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  }, []);

  const handleReset = React.useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotate(0);
    setFlipX(false);
    setFlipY(false);
  }, []);

  const handleRotateLeft = React.useCallback(() => {
    setRotate(prev => prev - 90);
  }, []);

  const handleRotateRight = React.useCallback(() => {
    setRotate(prev => prev + 90);
  }, []);

  const handleFlipX = React.useCallback(() => {
    setFlipX(prev => !prev);
  }, []);

  const handleFlipY = React.useCallback(() => {
    setFlipY(prev => !prev);
  }, []);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotateRight();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleFlipX();
          break;
        case 'v':
        case 'V':
          e.preventDefault();
          handleFlipY();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    onClose,
    handlePrevious,
    handleNext,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handleRotateRight,
    handleFlipX,
    handleFlipY,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Prevent backdrop click when clicking on interactive elements
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-10" onClick={handleContentClick}>
        <div className="rounded-lg bg-black/50 px-3 py-1">
          <span className="text-sm font-medium text-white">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute top-1/2 left-4 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute top-1/2 right-4 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Main Image Container */}
      <div className="relative z-0 flex h-full w-full items-center justify-center">
        <div
          ref={imageRef}
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px) rotate(${rotate}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
            }}
            onClick={handleContentClick}
          >
            <Image
              src={images[currentIndex]}
              alt={`${alt} ${currentIndex + 1}`}
              width={800}
              height={600}
              className="object-contain"
              priority
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2"
        onClick={handleContentClick}
      >
        <div className="flex items-center gap-1 rounded-lg bg-black/70 p-2 backdrop-blur-sm">
          {/* Zoom Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleZoomOut();
            }}
            disabled={zoom <= 0.5}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="px-2 text-xs text-white">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleZoomIn();
            }}
            disabled={zoom >= 5}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Transform Controls */}
          <div className="mx-2 h-4 w-px bg-white/30" />

          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleRotateLeft();
            }}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            title="Rotate Left"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleRotateRight();
            }}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            title="Rotate Right (R)"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleFlipX();
            }}
            className={cn(
              'h-8 w-8 p-0 text-white hover:bg-white/20',
              flipX && 'bg-white/20'
            )}
            title="Flip Horizontal (F)"
          >
            <FlipHorizontal className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleFlipY();
            }}
            className={cn(
              'h-8 w-8 p-0 text-white hover:bg-white/20',
              flipY && 'bg-white/20'
            )}
            title="Flip Vertical (V)"
          >
            <FlipVertical className="h-4 w-4" />
          </Button>

          <div className="mx-2 h-4 w-px bg-white/30" />

          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleReset();
            }}
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            title="Reset (0)"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
