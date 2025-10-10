
export interface MissionData{
    id: number,
    image: string,
    text: string
  }
  
  
2
  export const mission: MissionData[] = [
      {
        id: 1,
        image: "/image/aboutImages/icon1.png",
        text:
          "Shirley's was born from a mother's determination to bring authentic West African flavours to her family.",
      },
      {
        id: 2,
        image: "/image/aboutImages/icon2.png",
        text:
          "As a single mother of five, Shirley needed a way to preserve cultural food traditions despite limited time.",
      },
      {
        id: 3,
        image: "/image/aboutImages/icon3.png",
        text:
          "She created a carefully crafted Jollof paste that captured traditional flavours while cutting preparation time.",
      }
  ]