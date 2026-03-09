# MyWatchList

> **Follow people whose taste you trust. Rate movies. Discover films through people, not algorithms.**

A social movie discovery platform built with modern web technologies. MyWatchList solves the problem of generic movie ratings by enabling users to follow others whose taste they align with and discover movies through trusted recommendations.

**Live Demo:** [https://mywatchlist-eta.vercel.app/](https://mywatchlist-eight.vercel.app/)

---

## The Problem

Generic movie rating systems (IMDb, Rotten Tomatoes) provide aggregate scores, but they don't tell you *who* rated the movie or *why*. You can't discover films based on the taste of people you actually trust.

MyWatchList flips this: Instead of trusting an algorithm or a crowd, you follow people whose movie taste aligns with yours and discover what they're rating.

---

## The Solution

MyWatchList is a **social movie discovery platform** where:

- **Users rate movies** (1-10 scale) on a clean, minimal interface
- **Build public watchlists** of movies they've watched and rated
- **Follow people** whose taste they trust
- **Discover movies** through watchlists of people they follow
- **Share filtered watchlists** via shareable URLs (e.g., `/watchlist/john?rating=9&minRating=8`)
- **Explore trending watchlists** based on recency, rating, and engagement
- **View aggregated ratings** for any movie across all users

---

## Key Features

### 🎬 Core Features
- **Google OAuth Authentication** — Seamless sign-in with Google
- **Movie Search** — Powered by TMDB API with autocomplete
- **Rate & Watch** — 1-10 rating system with "watched" tracking
- **Public Watchlists** — Share your taste with the community
- **Follow System** — Build a curated feed from trusted users
- **Movie Detail Pages** — See aggregated ratings and community reviews
- **Trending Section** — Discover what's hot (by recency + rating + engagement)

### 🔗 URL-Based Discovery (NUQS-Ready Architecture)
- Shareable filtered URLs: `/watchlist/username?rating=5&minRating=7`
- Deep linking into taste profiles
- Persistent filter state across page refreshes

### 🛡️ Security & Privacy
- **Row Level Security (RLS)** on all user data
- Users can only edit/delete their own ratings
- Private auth tokens via Supabase
- Public profiles by default (can be made private in Phase 2)

---
## Improvements

The following improvements were added to the project:

- Movie recommendation system
- Movie trailer viewing feature
- User review functionality
- Improved navigation and routing
- Poster fallback system for missing images
- UI improvements using CSS modules

---
## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS + CSS Modules
- **Data Fetching:** React Query (@tanstack/react-query)
- **Type Safety:** TypeScript

### Backend & Infrastructure
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Google OAuth)
- **Row Level Security (RLS):** Enforced at database level
- **Hosting:** Vercel

### External Services
- **TMDB API:** Movie metadata, search, autocomplete

---

## Architecture

### Service → Types → Hooks → Components Pattern

**Clean separation of concerns:**

```
/services          # Supabase calls (business logic)
  - user.service.ts
  - watchlist.service.ts
  - movie.service.ts
  - rating.service.ts
  - follow.service.ts

/types             # TypeScript interfaces & payloads
  - user.types.ts
  - watchlist.types.ts
  - movie.types.ts
  - rating.types.ts
  - follow.types.ts

/hooks             # React Query + custom logic
  - useAuth.ts
  - useWatchlist.ts
  - useMovie.ts
  - useRating.ts
  - useFollow.ts

/components        # UI components (shadcn + custom)
  - /ui
  - /shared
  - Page components
```

**Example Flow:**
```typescript
// services/watchlist.service.ts
export const WatchlistService = {
  getWatchlist: async (username) => {
    return await supabase
      .from('watchlist_movies')
      .select('*, profiles(username, avatar_url)')
      .eq('user.username', username)
  }
}

// hooks/useWatchlist.ts
export const useWatchlist = (username) => {
  return useQuery({
    queryKey: ['watchlist', username],
    queryFn: () => WatchlistService.getWatchlist(username)
  })
}

// components/WatchlistPage.tsx
export default function WatchlistPage({ username }) {
  const { data } = useWatchlist(username)
  return <MovieGrid movies={data} />
}
```

---

## Database Schema

### Tables

**profiles**
```sql
id (UUID) | username (UNIQUE) | email | avatar_url | preferences (JSONB) | created_at
```

**watchlist_movies**
```sql
id | user_id | movie_id | title | poster_path | tmdb_id | rating | watched | added_at
```

**ratings**
```sql
id | user_id | movie_id | rating_value | created_at
```

**follows**
```sql
id | follower_id | following_id | created_at
```

### Row Level Security (RLS)

- **Profiles:** Public read, users edit own
- **Watchlist:** Public read, users write own
- **Ratings:** Public read, users write own
- **Follows:** Public read, users follow/unfollow

---

## Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Public landing page |
| `/auth/callback` | OAuth callback handler |
| `/onboarding` | Genre preference selection |
| `/dashboard` | User dashboard (personalized hub) |
| `/search` | Search & quick rate movies |
| `/watchlist/[username]` | View user's watchlist (public/editable) |
| `/discover/watchlists` | Browse all public watchlists |
| `/movies/[tmdbId]` | Movie detail & ratings |
| `/movies/[tmdbId]/ratings` | All ratings for a movie |
| `/trending` | Trending watchlists ranked |
| `/profile` | User profile & settings |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- TMDB API key
- Google OAuth credentials

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd mywatchlist

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add these to .env.local:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
# NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### Database Setup

1. Create Supabase project
2. Run SQL migrations (see `/migrations` folder)
3. Set up RLS policies
4. Configure Google OAuth

---

## Usage

### As a User
1. Sign in with Google
2. Select movie genres (or skip)
3. Search for a movie and rate it (1-10)
4. Browse other users' watchlists
5. Follow users whose taste you like
6. Discover trending watchlists

### As a Developer
1. Add new features via Service → Types → Hooks → Components pattern
2. React Query handles caching automatically
3. Supabase RLS enforces permissions
4. Deploy to Vercel with `vercel`

---

## Performance & Optimization

- **React Query Caching:** 5-min staleTime, 30-min gcTime
- **Image Optimization:** Next.js `<Image>` with lazy loading
- **Debounced Search:** 300ms debounce on movie search
- **Code Splitting:** Dynamic imports for heavy components
- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices)

---

## What I Learned Building This

### Technical
- Full-stack development with Next.js + Supabase
- Row Level Security (RLS) for database permission management
- Service layer architecture for clean code organization
- React Query for efficient data fetching & caching
- OAuth integration (Google)
- TypeScript type safety across full stack

### Product
- URL state management for shareable, deep-linkable features
- Social discovery patterns (following, trending)
- Public vs. private data models
- Pagination & filtering at scale
- User onboarding flows

---

## Future Enhancements (Phase 2)

- [ ] Comments on ratings
- [ ] Like/favorite watchlists
- [ ] Recommendation algorithm (collaborative filtering)
- [ ] Activity feed
- [ ] Email notifications
- [ ] Advanced search (full-text)
- [ ] Realtime updates (Supabase realtime)
- [ ] Multiple watchlists per user
- [ ] Export watchlist (CSV, JSON)
- [ ] Dark mode toggle

---

## Deployment

Deployed on **Vercel** with automatic deployments from main branch.

```bash
# Deploy to production
vercel --prod
```

Environment variables configured in Vercel dashboard.

---

## License

MIT License - feel free to use this project for learning or as a starter template.

---

## Questions?

Feel free to reach out or open an issue on GitHub.

**Live:** [https://mywatchlist-eta.vercel.app/](https://mywatchlist-eta.vercel.app/)  
**GitHub:** [your-github-repo]

---

**Built with ❤️ by Ogheneyoma**
