import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999]">      
      {/* Only blur overlay - no solid background */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/5" />
      
      {/* Loading content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white rounded-full p-6 shadow-xl border border-white/30">
            <Image
              src="/image/Logomark.png"
              alt="Logo"
              width={100}
              height={100}
              className="animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </div>
          
          {/* Loading dots */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


