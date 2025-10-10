export interface RecipeMetaInfo {
  serves: string
  cookTime: string
  cuisine: string
  difficulty: string
  prep: string
}

export interface RecipeInstruction {
  title: string
  description: string
}

export interface Recipe {
  id: string
  title: string
  slug: string
  heroImage: string
  metaInfo: RecipeMetaInfo
  ingredients: string[]
  instructions: RecipeInstruction[]
  chefTips?: string[]
  perfectPairings?: string
}

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Shirley's Classic Jollof Rice",
    slug: "shirleys-classic-jollof-rice",
    heroImage: "/image/landingPageImages/recipe1.png",
    metaInfo: {
      serves: "4-6 people",
      cookTime: "25 minutes",
      cuisine: "West African",
      difficulty: "Intermediate Level",
      prep: "5 minutes"
    },
    ingredients: [
      "A whole jar of Shirley's Original Jollof Paste",
      "400g basmati or long-grain rice",
      "Salt and pepper to taste",
      "Optional: mixed vegetables, cooked protein of choice"
    ],
    instructions: [
      {
        title: "Wash your rice",
        description: "Wash your rice in a cooking pot or rice cooker container"
      },
      {
        title: "Add Shirley's Jollof Paste",
        description: "Add 1 teaspoon of Shirley's Jollof Paste or the entire jar if you prefer a richer taste"
      },
      {
        title: "Add water",
        description: "Add the appropriate amount of water to the amount of rice used in step 1"
      },
      {
        title: "Season",
        description: "Add salt and pepper as desired or your secret ingredient, unique to your household"
      },
      {
        title: "Cover with foil",
        description: "Put a sheet of foil over the pot/container lid"
      },
      {
        title: "Cook and steam",
        description: "If using a rice cooker, simply go to cook mode and at the end of the cycle, give the rice a stir and let it steam with foil on once cooked for 10 minutes. If using the stove, please cook on a low heat and occasionally stir rice every 10 minutes until cooked. Once rice has cooked - usually 20-25mins, turn off stove and let the rice steam for 10mins with the foil and lid on."
      }
    ]
  },
  {
    id: "2",
    title: "Signature Sautéed Onions",
    slug: "signature-sauteed-onions",
    heroImage: "/image/landingPageImages/recipe2.png",
    metaInfo: {
      serves: "2-4 people",
      cookTime: "5-7 minutes",
      cuisine: "West African-Inspired",
      difficulty: "Beginner Level",
      prep: "3 minutes"
    },
    ingredients: [
      "2 tablespoons of Shirley's Original Jollof Paste",
      "1 medium-sized onion, sliced or chopped to your preference",
      "1 tablespoon of your preferred cooking oil (vegetable, sunflower, or olive oil work beautifully)",
      "Salt and pepper to taste (optional)"
    ],
    instructions: [
      {
        title: "Prepare your onion",
        description: "Peel and slice your medium onion into your preferred thickness. Whether you like them chunky or thinly sliced, both work wonderfully with this recipe."
      },
      {
        title: "Heat your pan",
        description: "Heat 1 tablespoon of your preferred oil in a wok or frying pan over high heat. Let the oil get nice and hot - you'll know it's ready when it shimmers slightly."
      },
      {
        title: "Sauté the onions",
        description: "Add your chopped onions to the hot pan and sauté for 2-3 minutes, stirring occasionally. Watch as they begin to soften and become fragrant."
      },
      {
        title: "Add the magic",
        description: "Stir in 2 heaped tablespoons of Shirley's Jollof Paste. Mix well to coat all the onions in that rich, authentic West African flavour. Cook for another 1-2 minutes until the paste is heated through and aromatic."
      },
      {
        title: "Create your masterpiece",
        description: "This is where the fun begins! Use these beautifully sautéed onions as the foundation for whatever sauce your heart desires. Whether you're building a hearty vegetable stew, a succulent chicken casserole, a tender lamb dish, or a robust beef creation - these onions are your flavour-packed starting point."
      }
    ],
    chefTips: [
      "These sautéed onions are incredibly versatile and serve as the perfect base for countless dishes",
      "The high heat helps caramelise the onions slightly while the jollof paste adds depth and complexity",
      "Don't be afraid to adjust the amount of jollof paste to suit your taste preferences - more paste means richer flavour!"
    ],
    perfectPairings: "Use as a base for curries, stews, pasta sauces, or even as a flavourful side dish on their own."
  },
  {
    id: "3",
    title: "Hearty Mushroom Spinach Stew",
    slug: "hearty-mushroom-spinach-stew",
    heroImage: "/image/landingPageImages/recipe3.jpg",
    metaInfo: {
      serves: "3-4 people",
      cookTime: "20-25 minutes",
      cuisine: "West African-Inspired",
      difficulty: "Intermediate Level",
      prep: "10 minutes"
    },
    ingredients: [
      "2 tablespoons of Shirley's Original Jollof Paste",
      "1/4 cup sweet corn (fresh, frozen, or canned - drained)",
      "250g fresh baby spinach, washed and roughly chopped",
      "1 cup mushrooms, cut in half (button, chestnut, or your preferred variety)",
      "1 medium tomato, diced into small chunks",
      "2 cloves garlic, finely chopped",
      "Half thumb-sized piece of fresh ginger, peeled and grated",
      "1 scotch bonnet pepper (whole for mild heat, or chilli flakes to taste)",
      "1/2 pint (300ml) water",
      "1 tablespoon preferred cooking oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      {
        title: "Prepare your aromatics",
        description: "Heat 1 tablespoon of oil in a large frying pan or heavy-bottomed pot over medium-high heat. Add your chopped onions and fry for 2 minutes until they start to soften and become fragrant."
      },
      {
        title: "Build the flavour base",
        description: "Add the finely chopped garlic and freshly grated ginger to the pan. Fry for another 2 minutes, stirring frequently to prevent burning. Your kitchen should smell absolutely incredible by now!"
      },
      {
        title: "Add the magic paste",
        description: "Stir in 2 tablespoons of Shirley's Jollof Paste, coating all the aromatics. Let it cook for about 1 minute to release those authentic West African flavours."
      },
      {
        title: "Layer in the vegetables",
        description: "Add the halved mushrooms, baby spinach, diced tomatoes, sweet corn, and your scotch bonnet pepper (pierce it lightly if you want more heat, or leave whole for gentle warmth)."
      },
      {
        title: "Create the stew",
        description: "Pour in the 1/2 pint of water and bring the mixture to a gentle boil. Once bubbling, reduce the heat to low and let it simmer for 15-20 minutes, stirring occasionally."
      },
      {
        title: "Perfect the seasoning",
        description: "Taste and adjust with salt and pepper as desired. The stew is ready when the vegetables are tender, the spinach has wilted completely, and the flavours have melded beautifully together."
      },
      {
        title: "Serve with love",
        description: "Remove the scotch bonnet if you prefer, and serve this nourishing stew hot."
      }
    ],
    chefTips: [
      "If using frozen spinach, reduce cooking time slightly as it wilts faster",
      "For a heartier meal, serve over rice, quinoa, or with crusty bread",
      "The scotch bonnet adds authentic heat - remove it early if you prefer milder flavours",
      "Fresh ginger makes all the difference - don't substitute with powder if possible"
    ],
    perfectPairings: "Serve alongside Shirley's Classic Jollof Rice, with warm flatbread, or over your favourite grains for a complete, satisfying meal."
  }
];

export const getRecipeBySlug = (slug: string): Recipe | undefined => {
  return recipes.find(recipe => recipe.slug === slug);
};

export const getAllRecipeSlugs = (): string[] => {
  return recipes.map(recipe => recipe.slug);
};