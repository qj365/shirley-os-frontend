"use client"

import Image from "next/image"

interface ProductImage {
  url: string;
  alt_text: string | null;
}

interface ImageGalleryProps {
  images: ProductImage[];
  thumbnail: string;
  title: string;
}

export default function ImageGallery({ images, thumbnail, title }: ImageGalleryProps) {
  // const router = useRouter();
  
  // Clean up image URLs (remove any backticks or extra spaces)
  const cleanUrl = (url: string) => url.replace(/`/g, '').trim();
  
  // Check if additional images are available
  const hasImage1 = images && images.length > 0 && images[0]?.url;
  const hasImage2 = images && images.length > 1 && images[1]?.url;
  
  // Determine height based on how many images we have
  const imageHeight = hasImage1 && hasImage2 ? "h-[50vh]" : "h-[100vh]";

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex flex-col">
        {/* First image - only show if available */}
        {hasImage1 && (
          <div className={`w-full bg-[#fff3d6] ${imageHeight} flex justify-center items-center`}>
            <Image 
              src={cleanUrl(images[0].url)} 
              alt={images[0].alt_text || title} 
              width={603} 
              height={798} 
              className="object-contain max-h-[90%] max-w-[90%] h-auto" 
              priority
            />
          </div>
        )}
        
        {/* Second image - only show if available */}
        {hasImage2 && (
          <div className={`w-full bg-[#FFC020] ${imageHeight} flex justify-center items-center`}>
            <Image 
              src={cleanUrl(images[1].url)} 
              alt={images[1].alt_text || title} 
              width={494} 
              height={533} 
              className="object-contain max-h-[90%] max-w-[90%] h-auto" 
              priority
            />
          </div>
        )}
        
        {/* If no additional images, show the main image */}
        {!hasImage1 && !hasImage2 && (
          <div className={`w-full bg-[#fff3d6] h-[100vh] flex justify-center items-center`}>
            <Image 
              src={cleanUrl(thumbnail)} 
              alt={title} 
              width={603} 
              height={798} 
              className="object-contain max-h-[90%] max-w-[90%] h-auto" 
              priority
            />
          </div>
        )}
      </div>
    </div>
  )
}