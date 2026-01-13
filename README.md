# Aster

Aster is a web application built for animal welfare organizations with `**Next.js**`, `**TypeScript**`, and `**Prisma**`.

It is developed as a single codebase covering frontend, backend, database, and deployment.

The application is free to use and contains no advertising.

---

## Overview

Aster is an authenticated application used to manage structured data involving:
- multiple entities
- explicit relationships
- role-based access control

The project serves both as:
- a real, usable application
- a factual representation of my current development skills

---

## Project characteristics

- Single-developer project  
- Deployed in production  
- Limited but evolving feature scope  
- Free to use  
- No advertising  

---

## Tech stack

```bash
- Next.js (App Router / Server Actions)
- TypeScript
- React
- Prisma ORM
- PostgreSQL
- next-intl (internationalization)
- Resend (transactional emails)
- Vercel (hosting and deployment)
- Neon (database)
```

---

## Application structure

- Routing, data loading, and access checks are handled server-side using Next.js
- Data mutations are implemented through **server actions**
- No public REST or RPC API is exposed
- Client-side code is limited to UI state and user interactions

---

## Data layer

- Relational PostgreSQL database
- Schema defined and versioned using Prisma
- Explicit modeling of:
  - users
  - organizations
  - memberships (roles, status)
  - domain entities and their relationships
- All database writes are executed server-side

---

## Access control

- Authentication required for all private routes
- Authorization based on organization membership and role
- Permission checks performed:
  - before page rendering
  - before executing server actions
- Unauthorized access is blocked

---

## Security considerations

- No unauthenticated access to private data
- Server-side validation for all mutations
- No sensitive error details exposed to the client
- Database access handled through Prisma (no raw SQL)

---

## Internationalization

- Aster is available in:
  - English
  - French
  - Norwegian

---

## Mobile usage and installation

Aster is designed for mobile use.

### Web access

The application can be accessed via a web browser at:  
[https://aster-pearl.vercel.app/]https://aster-pearl.vercel.app/

(You can view the authenticated part of the app with those demo credentials : demo@aster.app / AsterDemo2026!)

### Android

Aster is available on Google Play:  
[https://play.google.com/store/apps/details?id=com.quietforge.aster]https://play.google.com/store/apps/details?id=com.quietforge.aster

The Android version is distributed using a Trusted Web Activity (TWA) and runs the same web codebase.

### iOS

When accessed from Safari on an iPhone, the application can be installed as a Progressive Web App (PWA):

- Open the application in Safari  
- Use “Add to Home Screen”  

In this mode, the application runs fullscreen and independently from Safari.

---

## Repository note

This repository is not intended as a framework or starter template.

It reflects the current state of the application, including its implementation choices, constraints, and trade-offs.
