"use client"

import { ProductFlavour } from "@/services/product-types"
import Modal from "@/components/shared/modal"
import { Leaf, AlertTriangle, Apple, Refrigerator, Calendar, Info } from "lucide-react"

interface ProductDetailsModalProps {
  data: {
    title: string
    description: string
    ingredients: string
    shelf_life: string
    nutritional_info: string | Record<string, any>
    additional_info: string | Record<string, any>
    storage_instructions: string
    allergens: string
    flavour_name: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailsModal({ data, isOpen, onClose }: ProductDetailsModalProps) {
  // Function to format nutritional info from JSON
  const formatNutritionalInfo = (info: any) => {
    if (!info) return null
    
    // Parse the JSON if it's a string
    const nutritionalData = typeof info === 'string' ? JSON.parse(info) : info
    
    if (!nutritionalData.per_100g) return null
    
    const per100g = nutritionalData.per_100g
    
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-2">
          {per100g.energy_kcal && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Energy</span>
              <span className="font-medium">{per100g.energy_kcal} kcal</span>
            </div>
          )}
          {per100g.energy_kj && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Energy (kJ)</span>
              <span className="font-medium">{per100g.energy_kj} kJ</span>
            </div>
          )}
          {per100g.fat_g && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Fat</span>
              <span className="font-medium">{per100g.fat_g}g</span>
            </div>
          )}
          {per100g.saturates_g && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Saturates</span>
              <span className="font-medium">{per100g.saturates_g}g</span>
            </div>
          )}
          {per100g.carbohydrate_g && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Carbohydrates</span>
              <span className="font-medium">{per100g.carbohydrate_g}g</span>
            </div>
          )}
          {per100g.sugars_g && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Sugars</span>
              <span className="font-medium">{per100g.sugars_g}g</span>
            </div>
          )}
          {per100g.fibre_g && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Fiber</span>
              <span className="font-medium">{per100g.fibre_g}g</span>
            </div>
          )}
          {per100g.protein_g && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Protein</span>
              <span className="font-medium">{per100g.protein_g}g</span>
            </div>
          )}
          {per100g.salt_g && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Salt</span>
              <span className="font-medium">{per100g.salt_g}g</span>
            </div>
          )}
          {per100g.sodium_mg && (
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-600">Sodium</span>
              <span className="font-medium">{per100g.sodium_mg}mg</span>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // Function to format additional info from JSON
  const formatAdditionalInfo = (info: any) => {
    if (!info) return null
    
    // Parse the JSON if it's a string
    const additionalData = typeof info === 'string' ? JSON.parse(info) : info
    
    const dietaryInfo = []
    if (additionalData.vegan_suitable) dietaryInfo.push('Vegan')
    if (additionalData.vegetarian_suitable) dietaryInfo.push('Vegetarian')
    if (additionalData.kosher_suitable) dietaryInfo.push('Kosher')
    if (additionalData.organic_suitable) dietaryInfo.push('Organic')
    
    return (
      <div className="space-y-3">
        {dietaryInfo.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {dietaryInfo.map(item => (
                <span key={item} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {additionalData.ph_level && (
          <div>
            <p className="text-gray-700">PH Level: {additionalData.ph_level}</p>
          </div>
        )}
        
        {additionalData.product_specification && (
          <div>
            <p className="font-bold text-gray-700 mb-1">Specification</p>
            <p className="text-gray-700">{additionalData.product_specification}</p>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="py-4 px-2">
        <h2 className="text-xl md:text-2xl font-bold mb-6">{data.flavour_name} Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Left column */}
            {data.ingredients && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#FFC020]" /> Ingredients
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{data.ingredients}</p>
              </div>
            )}
            
            {data.allergens && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#FFC020]" /> Allergens
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{data.allergens}</p>
              </div>
            )}
            
            {data.storage_instructions && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <Refrigerator className="w-5 h-5 text-[#FFC020]" /> Storage Instructions
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{data.storage_instructions}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Right column */}
            {data.shelf_life && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#FFC020]" /> Shelf Life
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{data.shelf_life}</p>
              </div>
            )}
            
            {data.nutritional_info && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-[#FFC020]" /> Nutritional Information
                </h3>
                {formatNutritionalInfo(data.nutritional_info)}
              </div>
            )}
            
            {data.additional_info && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#FFC020]" /> Additional Information
                </h3>
                {formatAdditionalInfo(data.additional_info)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}