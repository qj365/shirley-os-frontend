export interface Product {
  id: string; // Changed from number to string to match your API
  name: string;
  images: {
    id: string;
    image_url: string;
    alt_text: string;
    sort_order: number;
    is_primary: boolean;
  }[]; // Array of image objects
  price: number; // Changed from string to number to match your API
  sale_price: number | null; // Added to match your API
  description: string;
}

export const shopSauce: Product[] = [
  {
    id: "1",
    name: "Shirley’s Red Sauce Bbq Flavours",
    images: [
      {
        id: "image1",
        image_url: "/image/sauce.png",
        alt_text: "Shirley’s Red Sauce Bbq Flavours",
        sort_order: 1,
        is_primary: true,
      },
    ],
    price: 17,
    sale_price: 18, // Added sale_price for consistency
    description: "Delicious BBQ sauce with Shirley’s unique flavour.",
  },
  {
    id: "2",
    name: "Shirley’s Red Sauce Bbq Flavours",
    images: [
      {
        id: "image2",
        image_url: "/image/sauce.png",
        alt_text: "Shirley’s Red Sauce Bbq Flavours",
        sort_order: 1,
        is_primary: true,
      },
    ],
    price: 18,
    sale_price: 30,
    description: "Delicious BBQ sauce with Shirley’s unique flavour.",
  },
  {
    id: "3",
    name: "Shirley’s Red Sauce Bbq Flavours",
    images: [
      {
        id: "image3",
        image_url: "/image/sauce.png",
        alt_text: "Shirley’s Red Sauce Bbq Flavours",
        sort_order: 1,
        is_primary: true,
      },
    ],
    price: 19,
    sale_price: 25,
    description: "Delicious BBQ sauce with Shirley’s unique flavour.",
  },
];
