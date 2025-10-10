

export interface TestimonialType{
    id: number;
    text: string;
    author: string;
    location: string;
    image:string;

}


export const testimonials:TestimonialType[] = [
    {
      id: 1,
      text: "I love Jollof rice, but I never had the time to make it from scratch. Shirley's Jollof Paste changed that! The flavours are rich, authentic, and taste just like homemade",
      author: "Emma T.",
      location: "London",
      image:"/image/landingPageImages/user1.png"
    },
    {
      id: 2,
      text: "As someone who grew up eating Jollof, I was skeptical at first, but this paste is the real deal! The spices are perfectly balanced, and the aroma is amazing.",
      author: "David O.",
      location: "Manchester",
      image:"/image/landingPageImages/user2.png"
    },
    {
      id: 3,
      text: "I've tried making Jollof rice before, but it never turned out right—until now! Shirley's Jollof Paste takes out all the guesswork. Just mix, cook, and enjoy.",
      author: "Sarah M",
      location: "Birmingham",
      image:"/image/landingPageImages/user3.png"
    },
    // {
    //   id: 4,
    //   text: "I’ve tried making Jollof rice before, but Shirley's Jollof Paste makes it easy—just mix, cook, and enjoy! The flavours are rich, authentic, and taste just like homemade.",
    //   author: "Jennifer T",
    //   location: "Munich",
    //   image:"/image/landingPageImages/user3.png"
    // },
  ]