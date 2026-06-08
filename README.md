# Aster

Aster is a web application designed for animal welfare organizations.

It is built as a single full-stack TypeScript codebase using **Next.js**, **Prisma**, and **PostgreSQL**.
The application is deployed in production and used by real organizations.

It is free to use and contains no advertising.

## Overview

Aster is intended to manage structured organizational data involving:
- access to multiple organizations, subject to admin approval
- distinct roles for each member within each organization
- registration of domain entities (animals, foster locations, adoption records, health acts)
- explicit relationships between these entities

The project serves both as:
- a functional application for real-world usage
- a concrete representation of my current development approach and technical level

## Tech stack

- Next.js (App Router / Server Actions)
- TypeScript
- React
- Prisma ORM
- PostgreSQL
- next-intl (internationalization)
- Zod (typed schemas)
- Resend (transactional emails)
- Vercel (hosting and deployment)
- Neon (database)

## Architecture overview

Aster is implemented as a monolithic full-stack application.
- Server-side routing and data loading are handled by Next.js.
- Data mutations are executed exclusively through server actions.
- No public REST or RPC API is exposed.
- Client-side code is limited to UI state and interactions.
- All database access is centralized through Prisma.

The project is structured by domain:
- `app/` for routing
- `actions/` for server-side mutations
- `lib/` for data access and permission logic
- `components/` for UI
- `i18n/` for internationalization

## Data model

The application relies on a relational PostgreSQL schema defined with Prisma.

Core entities include:
- Member
- Organization
- Animal + various health records
- Family (conceptually representing foster locations, including families, shelters, catteries, etc.)
- Treasury

MemberOrganization explicitly models both role and validation status for each member within each organization. Authorization decisions are derived from these relations.
FamilyMember defines the association between members and foster locations.

All writes occur server-side.
Database constraints enforce data integrity.

## Access control

Authentication is required for all private routes.
Authorization is based on organization membership, role, and status.

Permission checks occur:
- before rendering protected pages
- before executing server actions

Unauthorized access is blocked server-side.

## Notifications

Aster provides in-app notifications (no push notifications at this stage).

Two types are implemented:
- Active notifications, triggered by user actions affecting other members.
- Passive notifications, triggered when time-based conditions are met (e.g. health reminders).

Passive notifications are generated server-side when the application loads.  
No background jobs or cron system are currently used, though this is planned as a future improvement.

## Treasury

Aster provides a treasury module for tracking income and expenses by date and category.

Transactions can be filtered by year and category to simplify financial monitoring.

The module is not intended to replace accounting software, but to offer a simple and interactive alternative to the spreadsheets commonly used by animal welfare organizations.

## Public Pages

Aster provides a Public Pages module that allows organizations to publish adoptable animals on a dedicated public website.

Organizations can choose which animals are publicly visible, write adoption-focused descriptions, and automatically display information already available in the application, such as photos, age, health data, and contact details.

Public pages are generated directly from Aster's data and remain synchronized with the application. This avoids maintaining the same information in both an internal management tool and a separate website.

For organizations that already have a website, an embeddable version is also available and can be integrated with a simple iframe.

## Internationalization

Available languages:
- English
- French
- Norwegian (bokmål)

## Mobile usage and installation

Aster is designed for mobile use.

### Web access

The application can be accessed via a web browser at:  
[https://aster-app.eu/](https://aster-app.eu/)

(You can view the authenticated part of the app using those demo credentials : demo@aster.app / AsterDemo2026!)

### Android

Aster is available on Google Play:  
[https://play.google.com/store/apps/details?id=com.quietforge.aster](https://play.google.com/store/apps/details?id=com.quietforge.aster)

The Android version is distributed using a Trusted Web Activity (TWA) and runs the same web codebase.

### iOS

When accessed from Safari on an iPhone, the application can be installed as a Progressive Web App (PWA):

- Open the application in Safari  
- Use “Add to Home Screen”  

In this mode, the application runs fullscreen and independently from Safari.

## Limitations and scope

- Single-developer project
- Monolithic architecture
- Feature scope evolves iteratively
