# Quickstart: Livestream Dashboard

**Date**: 2026-01-18
**Feature**: 001-livestream-dashboard

## Prerequisites

- Node.js 18+ or Bun 1.0+
- RescueStream API running locally (default: `http://localhost:8080`)
- MediaMTX streaming server running (for video playback)
- Google OAuth credentials (for authentication)

## Setup Steps

### 1. Install Dependencies

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

### 2. Install Required Packages

```bash
# Core dependencies
bun add next-auth@beta @auth/core next-themes hls.js date-fns @radix-ui/react-icons swr

# shadcn/ui components
bunx --bun shadcn@latest add button dialog table input label dropdown-menu badge card toast skeleton pagination tooltip alert-dialog separator avatar
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# RescueStream API
RESCUESTREAM_API_URL=http://localhost:8080
RESCUESTREAM_API_KEY=admin
RESCUESTREAM_API_SECRET=your-api-secret-here

# Auth.js
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Start Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Verification Checklist

### Authentication
- [ ] Visit `/login` and see Google OAuth button
- [ ] Click "Sign in with Google" and complete OAuth flow
- [ ] After login, redirected to dashboard
- [ ] Session persists on page refresh

### Stream Grid
- [ ] Navigate to `/streams` (or dashboard home)
- [ ] See grid of live streams (or empty state if none active)
- [ ] Grid adapts: 1 stream = full, 4 = 2x2, 9 = 3x3
- [ ] Each tile shows broadcaster name and stream duration
- [ ] LIVE badge visible on active streams
- [ ] Click tile to enter fullscreen view
- [ ] Press Escape to return to grid

### Broadcaster Management
- [ ] Navigate to `/broadcasters`
- [ ] See data table with broadcaster list
- [ ] Click "Add Broadcaster" → dialog opens
- [ ] Fill name, submit → new broadcaster in table
- [ ] Click row edit → edit dialog with pre-filled data
- [ ] Click row delete → confirmation, then removed

### Stream Key Management
- [ ] Navigate to `/stream-keys`
- [ ] See data table with stream keys
- [ ] Click "Generate Key" → select broadcaster, submit
- [ ] Key value shown with copy button (one-time display)
- [ ] Copy button copies full stream URL
- [ ] Click revoke → confirmation, key marked revoked

### Theme Toggle
- [ ] Toggle button visible in header/sidebar
- [ ] Click toggles between light and dark mode
- [ ] Theme persists on refresh
- [ ] Respects system preference on first visit

### Navigation
- [ ] Sidebar visible on all dashboard pages
- [ ] Current page highlighted in sidebar
- [ ] Navigation between pages is instant

## Testing Stream Playback

### Start a Test Stream

Using FFmpeg to MediaMTX:

```bash
# Generate test stream with color bars
ffmpeg -re -f lavfi -i testsrc=size=1280x720:rate=30 \
  -f lavfi -i sine=frequency=1000:sample_rate=48000 \
  -c:v libx264 -preset ultrafast -tune zerolatency \
  -c:a aac -f flv \
  rtmp://localhost:1935/live/test-stream-key
```

Replace `test-stream-key` with an actual stream key from the API.

### Verify Playback

1. Stream should appear in grid within 5 seconds
2. HLS or WebRTC player should auto-start
3. Video should display with ~500ms latency (WebRTC) or 5-30s (HLS)

## Common Issues

### API Connection Failed
- Verify `RESCUESTREAM_API_URL` is correct
- Check API is running: `curl http://localhost:8080/health`
- Verify HMAC credentials match API configuration

### OAuth Redirect Error
- Ensure `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are correct
- Verify authorized redirect URIs in Google Cloud Console include `http://localhost:3000/api/auth/callback/google`

### Video Not Playing
- Check MediaMTX is running and accessible
- Verify stream URLs in API response are reachable
- Check browser console for CORS or connection errors

### Dark Mode Not Persisting
- Ensure `next-themes` ThemeProvider wraps the app
- Check localStorage for `theme` key

## API Quick Test

Test API connectivity:

```bash
# Check health (no auth required)
curl http://localhost:8080/health

# List streams (requires HMAC auth)
./scripts/api-test.sh GET /streams

# Create broadcaster
./scripts/api-test.sh POST /broadcasters '{"display_name":"Test Team"}'
```

## Next Steps

After verifying the quickstart:

1. Review [data-model.md](./data-model.md) for type definitions
2. Review [contracts/api-integration.md](./contracts/api-integration.md) for API details
3. Run `/speckit.tasks` to generate implementation tasks
4. Begin implementation following the task order
