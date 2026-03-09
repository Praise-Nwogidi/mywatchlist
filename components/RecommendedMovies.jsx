"use client"

import { useEffect, useState } from "react"
import { getUserRecommendations } from "@/lib/getRecommendations"
import MovieCard from "./MovieCard"
import { supabase } from "@/lib/supabase"

export default function RecommendedMovies() {

  const [movies, setMovies] = useState([])

  useEffect(() => {

    async function fetchRecommendations() {

      const { data: user } = await supabase.auth.getUser()

      if (!user?.user) return

      const recs = await getUserRecommendations(user.user.id)

      setMovies(recs)
    }

    fetchRecommendations()

  }, [])

  if (movies.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mt-10 mb-4">
🎯 Movies You Might Like
</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}