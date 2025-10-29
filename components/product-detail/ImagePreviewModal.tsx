'use client';

import * as React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';

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
  const slides = React.useMemo(
    () => images.map((src, i) => ({ src, alt: `${alt} ${i + 1}` })),
    [images, alt]
  );

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      index={currentIndex}
      slides={slides}
      plugins={[Zoom, Thumbnails]}
      on={{
        view: ({ index }) => {
          if (typeof index === 'number' && index !== currentIndex) {
            onIndexChange(index);
          }
        },
      }}
      render={{}}
      controller={{
        closeOnBackdropClick: true,
      }}
      carousel={{
        finite: images.length <= 1,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      thumbnails={{
        position: 'bottom',
        vignette: true,
      }}
    />
  );
}
