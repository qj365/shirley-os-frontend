// "use client"

// import { useState, useEffect } from "react"

// export function useMediaQuery(query: string): boolean {
//   const [matches, setMatches] = useState(false)

//   useEffect(() => {
//     const mediaQuery = window.matchMedia(query)

//     // Set initial value
//     setMatches(mediaQuery.matches)

//     // Create event listener function
//     const handler = (event: MediaQueryListEvent) => {
//       setMatches(event.matches)
//     }

//     // Add event listener
//     mediaQuery.addEventListener("change", handler)

//     // Clean up
//     return () => {
//       mediaQuery.removeEventListener("change", handler)
//     }
//   }, [query])

//   return matches
// }
"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Initial check
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Add listener for changes
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    // Clean up
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}
