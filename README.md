# Vaibhav Satish — Research & Portfolio

[![Theme](https://img.shields.io/badge/Theme-Anthropic%20Editorial-c2410c)](#design-system)
[![Database](https://img.shields.io/badge/Database-Supabase-065f46)](supabase-setup.sql)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)](DEPLOYMENT.md)

Personal portfolio and technical essay platform for **Vaibhav Satish**, focusing on **AGI Safety**, **Mechanistic Interpretability**, **Scalable Oversight**, and **Neurosymbolic AI**.

---

## 📂 Project Structure

```
.
├── index.html                # Home page (Minimalist non-scrollable hero)
├── research.html             # Select Research & Papers
├── writings.html             # Essays & Articles index with live engagement stats
├── machine-unlearning.html   # Technical Essay: Machine Unlearning
├── brain-consciousness.html  # Technical Essay: Neuroscience & Philosophy of Mind
├── regular.html              # Preserved full interactive portfolio codebase
│
├── css/
│   └── research.css          # Anthropic-like editorial design system & engagement styles
│
├── js/
│   ├── engagement.js         # Client-side Likes, Shares & Comments system
│   └── components/           # Component modules
│
├── assets/
│   ├── images/               # Article and profile images
│   ├── icons/                # Favicon and SVGs
│   └── documents/            # CV & documents
│
└── supabase-setup.sql        # Database migration script for Likes & Comments
```

---

## 🎨 Design System

Inspired by Anthropic’s research publication theme:
- **Typography**: Paired `'Newsreader'` (serif) for titles & essays with `'DM Sans'` (sans-serif) for kickers, tabs, and meta badges.
- **Color Palette**: Warm off-white paper canvas (`#faf9f6`), dark charcoal ink (`#1a1a18`), surface cards (`#f3f1ec`), and terracotta accents (`#c2410c`).

---

## ⚡ Live Engagement System (Supabase)

Includes real-time article engagement features:
- **Likes / Claps**: Tracked per article and stored in Supabase (`article_likes` table).
- **Social & Link Sharing**: One-click URL copying with toast notifications and Web Share API.
- **Discussion & Comments**: Reader comment submission and live display (`article_comments` table).
- **Fallback**: Auto-falls back to `localStorage` during local development when credentials aren't set.

---

## 🚀 Deployment

- **Vercel**: Pre-configured static deployment for Vercel edge CDN.
- **Database**: Database setup instructions and SQL migration script are in [`supabase-setup.sql`](supabase-setup.sql).

---

## 📞 Contact

- **GitHub**: [github.com/Vaibhav-sa30](https://github.com/Vaibhav-sa30)
- **LinkedIn**: [linkedin.com/in/vaibhavsatish](https://linkedin.com/in/vaibhavsatish)
- **Email**: [vaibhavsatish9@gmail.com](mailto:vaibhavsatish9@gmail.com)
