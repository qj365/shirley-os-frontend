
export interface TimelineData{
  id:number,
  year: string,
  title: string,
  description: string
}



export const timelineData: TimelineData[] = [
    {
      id:1,
      year: "2019",
      title: "Rooted in North London",
      description:
        "Shirley's was born from a mother's determination to bring authentic West African flavours to her family.",
    },
    {
      id:2,
      year: "2019",
      title: "A Mother's Challenge",
      description:
        "As a single mother of five, Shirley needed a way to preserve cultural food traditions despite limited time.",
    },
    {
      id:3,
      year: "2020",
      title: "The Jollof Paste Solution",
      description:
        "She created a carefully crafted Jollof paste that captured traditional flavours while cutting preparation time.",
    },
    {
      id:4,
      year: "2021",
      title: "From Home to Business",
      description:
        "What started as a family solution grew as friends and their friends began requesting jars of this culinary treasure.",
    },
  ]