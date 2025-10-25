import { cn } from '@/lib/utils';

interface RichContentProps {
  content: string;
  className?: string;
}

export default function RichContent({ content, className }: RichContentProps) {
  return (
    <div
      className={cn('rich-content', className)}
      dangerouslySetInnerHTML={{
        __html: content || '',
      }}
    />
  );
}
