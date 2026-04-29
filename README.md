# Family - Member Management Platform

A modern family member management application built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), and [Tailwind CSS](https://tailwindcss.com).

## Features

- 👤 **Member Profiles** - Manage detailed family member information
- 🔐 **Secure Authentication** - Email verification and password-based auth via Supabase
- 🔗 **Shareable Login Links** - Generate secure, time-limited links for family member access
- 📊 **Dashboard** - View family statistics and member overview
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Lucide icons

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Shareable Login Links

Shareable login links allow you to invite family members to join without sharing passwords.

### Generating a Shareable Link

```bash
curl -X POST http://localhost:3000/api/shareable-links \
  -H "Content-Type: application/json" \
  -d '{"email": "family@example.com"}'
```

**Response:**
```json
{
  "success": true,
  "link": "http://localhost:3000/share/a1b2c3d4...",
  "token": "a1b2c3d4...",
  "expiresAt": "2026-05-06T12:00:00Z"
}
```

### Using a Shareable Link

1. Share the link with a family member
2. They click the link and visit `/share/[token]`
3. Their email is pre-filled for security
4. They enter their password to complete login
5. The link is marked as used and cannot be reused

### Link Features

- **Expiration**: Links expire after 7 days
- **One-time Use**: Each link can only be used once
- **Email Pre-filled**: Security measure to ensure proper recipient
- **Database Tracked**: All links stored in `shareable_links` table

### Database Setup

Run the migration to create the `shareable_links` table:

```sql
-- Create shareable_links table
CREATE TABLE IF NOT EXISTS shareable_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_shareable_links_token ON shareable_links(token);
CREATE INDEX idx_shareable_links_email ON shareable_links(email);
CREATE INDEX idx_shareable_links_expires_at ON shareable_links(expires_at);
```

See `migrations/001_create_shareable_links.sql` for the full migration.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# App URL (for generating shareable links)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change in production
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## Project Structure

```
family/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── shareable-links/      # Shareable link generation API
│   ├── components/               # Reusable React components
│   ├── dashboard/                # Dashboard pages
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── profile/                  # User profile page
│   ├── share/[token]/            # Shareable link handler page
│   └── ...other pages
├── lib/                          # Utility functions
│   ├── auth.ts                   # Authentication helpers
│   ├── supabaseClient.ts         # Supabase client setup
│   ├── shareableLink.ts          # Shareable link utilities
│   └── ...other utilities
├── migrations/                   # Database migrations
├── types/                        # TypeScript type definitions
├── tests/                        # Test files
└── public/                       # Static assets
```

## API Endpoints

### `POST /api/shareable-links`
Generate a new shareable login link.

**Request:**
```json
{
  "email": "family@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "link": "http://localhost:3000/share/a1b2c3d4...",
  "token": "a1b2c3d4...",
  "expiresAt": "2026-05-06T12:00:00Z"
}
```

### `GET /api/shareable-links?token=<token>`
Validate a shareable link and retrieve the associated email.

**Response:**
```json
{
  "success": true,
  "email": "family@example.com",
  "token": "a1b2c3d4..."
}
```

## Testing

Run tests with:

```bash
npm test                # Unit tests
npm run test:ui         # Test UI
npm run test:coverage   # Coverage report
npm run e2e             # End-to-end tests
```

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.