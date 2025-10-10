
export interface PremiumType {
    id:number;
    title:string;
    para:string;
    image:string;
}

export const premiumData:PremiumType[]=[
    {
        id:1,
        title:"Shirley's Jollof Paste",
        para:"The heart of our collection, available in classic and signature variations",
        image:"/image/landingPageImages/premium2.png",
    },
    {
        id:2,
        title:"Shirley's Red Sauce",
        para:"Red sauce versatile accompaniments inspired by regional recipes",
        image:"/image/landingPageImages/premium3.jpg",
    }
]