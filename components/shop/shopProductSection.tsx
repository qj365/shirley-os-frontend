

"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import JollofPasteSection from "./jollofPasteSection"
import RedSauceSection from "./redSauceSection"
import ShopBundles from "./shopBundles"
import { getProductCategories } from "@/services/product-service"
import { MedusaProductCategory } from "@/services/product-service"

function ShopProductSection() {
  // State to track the active category
  const [activeCategory, setActiveCategory] = useState("All")
  const [, setActiveCategoryId] = useState<string | null>(null)
  const [categories, setCategories] = useState<MedusaProductCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  // const router = useRouter()

  // Define the desired order of categories
  const categoryOrder = [
    "Shirley's Jollof Paste",
    "Shirley's Red Sauce", 
    "Shirley's Bundles"
  ]

  // Function to sort categories in the desired order
  const sortCategories = (categories: MedusaProductCategory[]) => {
    return categories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.name)
      const indexB = categoryOrder.indexOf(b.name)
      
      // If both categories are in our order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      
      // If only one is in our order array, prioritize it
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      
      // If neither is in our order array, maintain original order
      return 0
    })
  }

  // Fetch all product categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productCategories = await getProductCategories()
        const sortedCategories = sortCategories(productCategories)
        setCategories(sortedCategories)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching product categories:", error)
        setIsLoading(false)
      }
    }

    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Effect to set the active category based on URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      // Check if the category parameter matches any of our categories
      if (categoryParam === "All") {
        setActiveCategory("All")
        setActiveCategoryId(null)
      } else {
        // Find the category in our fetched categories
        const matchedCategory = categories.find(cat => cat.name === categoryParam)
        if (matchedCategory) {
          setActiveCategory(matchedCategory.name)
          setActiveCategoryId(matchedCategory.id)
        }
      }
    }
  }, [searchParams, categories])

  // Function to handle category button clicks
  const handleCategoryClick = (category: string, categoryId: string | null) => {
    setActiveCategory(category)
    setActiveCategoryId(categoryId)
    
    // Update the URL with the selected category
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === "All") {
      // Remove the category parameter if "All" is selected
      params.delete('category')
    } else {
      // Set the category parameter for other categories
      params.set('category', category)
    }
    
    // Construct the new URL
    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ''}`
    
    // Update the URL without refreshing the page
    window.history.pushState({}, '', newUrl)
  }

  // Function to determine which section to render
  const renderProductSection = () => {
    // If we're still loading categories, don't render anything yet
    if (isLoading) {
      return <div>Loading categories...</div>
    }

    // Find the category objects for our specific product types
    const jollofPasteCategory = categories.find(cat => cat.name === "Shirley's Jollof Paste")
    const redSauceCategory = categories.find(cat => cat.name === "Shirley's Red Sauce")
    const bundlesCategory = categories.find(cat => cat.name === "Shirley's Bundles")

    switch (activeCategory) {
      case "Shirley's Jollof Paste":
        return <JollofPasteSection categoryId={jollofPasteCategory?.id} />
      case "Shirley's Red Sauce":
        return <RedSauceSection categoryId={redSauceCategory?.id} />
      case "Shirley's Bundles":
        return <ShopBundles categoryId={bundlesCategory?.id} />
      default:
        // For "All" category, show all sections in the desired order
        return (
          <>
            <JollofPasteSection categoryId={jollofPasteCategory?.id} />
            <div className="mt-12">
              <RedSauceSection categoryId={redSauceCategory?.id} />
            </div>
            <div className="mt-12">
              <ShopBundles categoryId={bundlesCategory?.id} />
            </div>
          </>
        )
    }
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-40 py-12 sm:py-16 lg:py-20">
      {/* Product Category Tabs */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-12 sm:mb-16">
        <button
          key="all"
          className={`${
            activeCategory === "All"
              ? "bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] text-black"
              : "bg-[#E4E4E4] text-black text-opacity-90 hover:bg-gradient-to-r hover:from-[#F3C03F] hover:to-[#FFBA0A] hover:text-black hover:text-opacity-100"
          } transition-all duration-300 font-semibold text-base sm:text-sm lg:text-base xl:text-lg px-6 sm:px-5 lg:px-6 py-2 sm:py-2 lg:py-2 rounded-full hover:cursor-pointer whitespace-nowrap`}
          onClick={() => handleCategoryClick("All", null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${
              activeCategory === category.name
                ? "bg-gradient-to-r from-[#F3C03F] to-[#FFBA0A] text-black"
                : "bg-[#E4E4E4] text-black text-opacity-90 hover:bg-gradient-to-r hover:from-[#F3C03F] hover:to-[#FFBA0A] hover:text-black hover:text-opacity-100"
            } transition-all duration-300 font-semibold text-base sm:text-sm lg:text-base xl:text-lg px-6 sm:px-5 lg:px-6 py-2 sm:py-2 lg:py-2 rounded-full hover:cursor-pointer whitespace-nowrap`}
            onClick={() => handleCategoryClick(category.name, category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Render the appropriate product section based on active category */}
      {renderProductSection()}
    </div>
  )
}

export default ShopProductSection
