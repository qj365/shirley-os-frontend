import { notFound } from 'next/navigation';
import RecipeHero from '@/components/recipe/recipe-hero';
import RecipeDetails from '@/components/recipe/recipe-details';
import RecipeTestimonial from '@/components/recipe/recipe-testimonial';
import RelatedRecipes from '@/components/recipe/related-recipes';
import { getRecipeBySlug, getAllRecipeSlugs } from '@/constants/recipe-data/recipes';

interface RecipePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllRecipeSlugs();
  return slugs.map(slug => ({
    slug: slug,
  }));
}

export default function RecipePage({ params }: RecipePageProps) {
  const recipe = getRecipeBySlug(params.slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <RecipeHero recipe={recipe} />
      <RecipeDetails recipe={recipe} />
      <RecipeTestimonial />
      <RelatedRecipes currentRecipeSlug={params.slug} />
    </div>
  );
}
