import React from 'react';
import Modal from '../shared/modal';
import { cn } from '@/lib/utils';

export default function ProductDetailDescription({
  description,
}: {
  description: string;
}) {
  const [showReadMore, setShowReadMore] = React.useState(false);
  const descriptionRef = React.useRef<HTMLParagraphElement>(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] =
    React.useState(false);

  React.useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setShowReadMore(element.scrollHeight > element.clientHeight);
    }
  }, []);

  return (
    <>
      <div className="relative">
        <p
          ref={descriptionRef}
          className={cn(
            showReadMore ? 'line-clamp-4' : '',
            'text-sm leading-relaxed md:text-base'
          )}
          dangerouslySetInnerHTML={{
            __html: description || '',
          }}
        />
        {showReadMore && (
          <>
            <div className="absolute right-0 bottom-0 h-6 w-45 bg-gradient-to-l from-white via-white to-transparent"></div>
            <button
              onClick={() => setIsDescriptionModalOpen(true)}
              className="absolute right-0 bottom-0 pl-2 text-sm leading-relaxed font-medium text-[#F3C03F] hover:underline md:text-base"
            >
              {' '}
              read more
            </button>
          </>
        )}
      </div>

      <Modal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
      >
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Product Description</h3>
          <div
            className="text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: description || '',
            }}
          />
        </div>
      </Modal>
    </>
  );
}
