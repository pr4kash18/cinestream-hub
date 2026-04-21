
## Ideas to Level Up CineStream

Your platform already has the core: auth, admin, watchlist, downloads, premium tiers, contact. Here are high-impact additions, grouped by effort. Pick any combination and I'll build them.

### Quick wins (small, high polish)

1. **Inline video player on Movie Detail**
   Click "Watch Now" → custom HTML5 player opens (play/pause, seek, fullscreen, quality switcher pulling from `video_urls`). Premium movies redirect free users to `/premium`.

2. **Hero "Continue Watching" row**
   New `watch_progress` table tracks playback position per user/movie. Homepage shows a resume row.

3. **Trending & Top 10 rows**
   Use existing `views` and `likes` columns on `movies` to render "Trending This Week" and a numbered "Top 10" slider on the homepage.

4. **Like / Rate movies (separate from watchlist)**
   Add a thumbs-up + 5-star rating. New `movie_ratings` table; aggregate updates the movie's `rating` column via trigger.

5. **Comments / Reviews**
   The MovieDetail page already has a "Comments" placeholder — wire it to a `comments` table with RLS (anyone reads, authed users post, owner deletes).

### Medium features

6. **Search upgrades**
   Filters bar on `/search` and `/browse`: genre multi-select, year range, rating, language, quality, free/premium toggle. Sort by newest / most viewed / highest rated.

7. **Profile page (`/profile`)**
   Edit display name + avatar (upload to a new `avatars` bucket), see watchlist count, subscription tier, member-since date.

8. **Notifications system (real)**
   Replace the placeholder bell with a `notifications` table + Supabase Realtime. Triggers: new movie added (admin broadcast), reply to your comment, subscription status change. Unread badge on the bell icon.

9. **Admin dashboard analytics**
   On `/admin` add a stats tab: total users, total movies (free vs premium), top 10 most-viewed, signups over time, recent contact messages inline (since email isn't set up yet, this is the read inbox).

10. **TV shows / Series support**
    Extend schema with `series` + `episodes` tables. Detail page gets a season/episode picker. Admin gets a "Add Series" flow.

### Bigger plays

11. **Recommendations**
    "Because you watched X" row using genre overlap from watchlist + ratings. Pure SQL, no ML needed.

12. **Subtitles & multi-audio**
    Add `subtitles` JSONB to movies (`{ "en": "url.vtt", "es": "url.vtt" }`). Player renders `<track>` elements with a CC menu.

13. **Stripe payments (revisit later)**
    Wire the $9 Pro / $25 Premium buttons to real checkout. Gate premium movies + downloads by `subscriptions.status = 'active'`.

14. **Email infrastructure**
    Set up a custom domain so the contact form actually emails `cpchoubisa18@gmail.com`, plus welcome emails on signup and "new movie" digests.

### Suggested next bundle (my pick)

If you want one focused round, I'd do **#1 (video player) + #6 (search filters) + #9 (admin analytics + inbox)**. Together they make the app feel finished: users can actually watch, find, and you can manage everything from `/admin` without leaving the site.

### Technical notes
- All new tables get RLS following the existing patterns (admin via `is_admin_email()` / `has_role()`, users via `auth.uid() = user_id`).
- Realtime notifications need `ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications`.
- Avatar/subtitle uploads reuse the storage bucket pattern from `movie-thumbnails`.
- No new dependencies needed for #1–#10; player uses native `<video>` + Tailwind.

### Reply with
Either pick numbers (e.g. "do 1, 6, 9") or say "surprise me" and I'll ship the suggested bundle.
