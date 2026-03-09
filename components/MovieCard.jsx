import Link from "next/link"

export default function MovieCard({ movie }) {

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-image.webp"

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="movie-card">

        <img
          src={imageUrl}
          alt={movie.title}
        />

        <h3>{movie.title}</h3>
        <p>⭐ {movie.vote_average}</p>

      </div>
    </Link>
  )
}