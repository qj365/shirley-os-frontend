import WholesaleRecipes from '@/components/wholesale/wholeSaleRecipes'
import WholesaleGrid from '@/components/wholesale/wholesaleGrid'
import WholesaleHero from '@/components/wholesale/wholesaleHero'
import React from 'react'

function Wholesale() {
  return (
    <div > 

        <WholesaleHero/>
        <WholesaleGrid/>
        <WholesaleRecipes color="#ffffff" card={9} showButton={false}/>
    </div>
  )
}

export default Wholesale