export async function getRecommendations(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  )

  const data = await res.json()

  return data.results
}

import { supabase } from "@/lib/supabase"

export async function getUserRecommendations(userId) {

  const { data: ratings } = await supabase
    .from("ratings")
    .select("movie_id")
    .eq("user_id", userId)
    .gte("rating_value", 7)
    .limit(3)

  if (!ratings) return []

  const recs = await Promise.all(
    ratings.map((r) => getRecommendations(r.movie_id))
  )

  return recs.flat().slice(0, 12)
}