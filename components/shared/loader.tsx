import React from "react";
import Skeleton from "react-loading-skeleton";  // Skeleton loader import

const Loader = ({ type = "text" }) => {



    
  if (type === "text") {
    return (
      <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 text-center">
        <Skeleton width={300} height={40} /> {/* Skeleton for heading */}
        <Skeleton width={500} height={30} /> {/* Skeleton for paragraph */}
      </div>
    );
  }

  // You can add more types of loaders here, such as image skeleton loader, etc.
  return <Skeleton width={200} height={200} circle={true} />; // Example: Circular skeleton for images
};

export default Loader;
