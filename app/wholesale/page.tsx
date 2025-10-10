import OurRecipes from '@/components/landing/our-recipes';
import WholesaleGrid from '@/components/wholesale/wholesaleGrid';
import WholesaleHero from '@/components/wholesale/wholesaleHero';

function Wholesale() {
  return (
    <div>
      <WholesaleHero />
      <WholesaleGrid />
      <OurRecipes bgClassName="bg-white" />
    </div>
  );
}

export default Wholesale;
