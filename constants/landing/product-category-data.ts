

export interface Data {
    id: number;
    title: string;
    image: string;
    category_id: string; // Added category_id field
}


export const ProductData: Data[] =[
    
    {
        id:1,
        title:"Shirley's Jollof Paste",
        image:"/image/landingPageImages/4paste.png",
        category_id: "JPF002"
    },
    {
        id:2,
        title:"Shirley's Red Sauce",
        image:"/image/landingPageImages/sauce.png",
        category_id: "SFU002"
    },
    {
        id:3,
        title:"Shirley's Bundles",
        image:"/image/landingPageImages/sauceandpaste.png",
        category_id: "BUN001"
    },
]