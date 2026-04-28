# EventFurn — Next.js Frontend

Full-stack frontend for the furniture rental quote system.
Built with Next.js 14 (App Router), Tailwind CSS, shadcn/ui components.

## Setup

```bash
npm install
# Backend must be running at http://localhost:4000
npm run dev
```

Open http://localhost:3000

---

## Routes

### Public Site
| Path | Description |
|------|-------------|
| `/` | Homepage with category grid + CTA |
| `/products` | Product catalogue — filter by category, search, paginate |
| `/quote` | Cart review + event details form → submits quote to backend |

### Admin Panel
| Path | Description |
|------|-------------|
| `/admin` | Dashboard: stats + recent quotes + Seed DB button |
| `/admin/categories` | Create / edit / delete categories |
| `/admin/products` | Full product CRUD with expandable variant management |
| `/admin/quotes` | Quote list with status filter + detail panel; advance quote status |

---

## Key Design Decisions

- **Cart is client-only** (localStorage via `useCart` hook). No login required for the public site.
- **Quote submission** accepts inline user details — the backend creates the user if the email is new.
- **Admin has no auth** (add middleware later when ready).
- **Seed button** on dashboard wipes + re-seeds the DB — only works when `NODE_ENV !== production`.
- All API calls go through `src/lib/api.ts` — change `NEXT_PUBLIC_API_URL` in `.env.local` to point to a different backend.

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
