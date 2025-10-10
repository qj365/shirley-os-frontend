export interface Hotseller{
    id:number,
    title:string,
    subtitle:string,
    image:string,
    price:string,
    oldPrice:string,
    category:string,
    flavour?:string
}


export const hotSeller: Hotseller[] =[
    {
        
        id:3,
        title:"Shirley's Jollof Paste",
        subtitle:"Original Flavour",
        image:"https://res.cloudinary.com/dlejkgrdw/image/upload/v1746885052/Original_Transparent_hhadgm.png",
        price:"£16.99",
        oldPrice:"£17.99",
        category:"Shirley's Jollof Paste"
    },
    {
        id:1,
        title:"Shirley's Jollof Paste",
        subtitle:"Beef Flavour",
        image:"https://res.cloudinary.com/dlejkgrdw/image/upload/v1746885051/Beef_Transparent_terhc5.png",
        price:"£16.99",
        oldPrice:"£17.99",
        category:"Shirley's Jollof Paste"
    },
    {
        id:2,
        title:"Shirley's Jollof Paste",
        subtitle:"Chicken Flavour",
        image:"https://res.cloudinary.com/dlejkgrdw/image/upload/v1746885051/Chicken_Transparent_zyccbe.png",
        price:"£16.99",
        oldPrice:"£17.99",
        category:"Shirley's Jollof Paste"
    },
    {
        
        id:4,
        title:"Shirley's Red Sauce",
        subtitle:"BBQ Flavour",
        image:"https://storage.mlcdn.com/account_image/1345915/jm4JePbEPqlVF8movPZIHNbCPS3CCJnGAfXnAmgO.png",
        price:"£17.99",
        oldPrice:"£18.99",
        category:"Shirley's Red Sauce"
    },
    {
        
        id:5,
        title:"Shirley's Red Sauce",
        subtitle:"Sweet Chilli Flavour",
        image:"https://storage.mlcdn.com/account_image/1345915/YO5M2iiiVXqvdql5wXI2lbrdjXHI50cnsV8NQKP7.png",
        price:"£17.99",
        oldPrice:"£18.99",
        category:"Shirley's Red Sauce"
    },
    {
        
        id:6,
        title:"Shirley's Red Sauce",
        subtitle:"Ketchup Flavour",
        image:"https://storage.mlcdn.com/account_image/1345915/xaezguSMRlPYgVIfsSc4O09ZPRXScpW8MlzhclOL.png",
        price:"£17.99",
        oldPrice:"£18.99",
        category:"Shirley's Red Sauce"
    }
]