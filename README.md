# Dan's Commission App (Art Commission Platform)

A specialized platform for managing art commissions, handling payments via Xendit, and tracking PH tax compliance. Built for professional freelance artists to streamline their business operations.

## 🚀 Overview

This application serves two main users:
1.  **The Artist (Admin):** A "Command Center" to manage the queue, track finances (BIR tax ready), showcase portfolio, and communicate with clients.
2.  **The Client:** A passwordless, secure portal to track commission status, view work-in-progress, and pay invoices.

## 🛠 Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (App Directory)
*   **Backend / Database:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
*   **Payments:** [Xendit](https://xendit.co/) (Invoices & Webhooks)
*   **Styling:** TailwindCSS
*   **Language:** TypeScript

## ✨ Key Features

### 🎨 Commission Management
*   **Kanban Workflow:** Track commissions from `PENDING` -> `IN_PROGRESS` -> `COMPLETED`.
*   **Milestone Payments:** Enforced 50% non-refundable deposit before work starts. High-res files locked until final 50% paid.
*   **Revision Gates:** Automatic tracking of revision rounds. Triggers extra fees if limit exceeded.

### 🔐 Client Portal
*   **Passwordless Access:** Secure "Magic Link" (UUID) for each commission.
*   **Live Status:** Progress bar reflecting real-time artist updates.
*   **Reference Gallery:** View sketches and WIPs without email clutter.
*   **Dynamic Payments:** "Pay Now" buttons generated on the fly via Server Actions.

### 🇵🇭 Business & Tax Tools
*   **Automated Invoicing:** Xendit Invoice generation.
*   **Fiscal Reporting:** Real-time calculation of Gross Receipts, Xendit Fees, and Net Income.
*   **Compliance:** Automatic estimation of 8% Income Tax for BIR filing.
*   **Receipts:** Generates PDF Collection Receipts upon successful payment webhooks.

### 📝 CMS
*   **Portfolio:** Manage public gallery items.
*   **Devlog:** Write and publish blog posts.

## 📂 Project Structure

```bash
.plan/                  # Project Documentation & Requirements
  ├── admin_experience/ # Admin UI & Logic docs
  ├── business_ops/     # Legal, Tax, & operational guides
  └── requirements/     # Technical Specs & Schema
app/
  ├── admin/            # Admin Dashboard (Secure)
  ├── portal/           # Client View (Public/UUID)
  └── api/
      └── webhooks/     # Xendit Payment Listener
```

## ⚡ Getting Started

### 1. Database Setup
The project uses Supabase. Run the SQL commands in `schema.sql` (or `.plan/requirements/SCHEMA_MIGRATIONS.md`) in your Supabase SQL Editor to set up:
*   Tables: `commissions`, `portfolio_items`, `posts`, `activity_logs`.
*   Enums: Status & Payment types.
*   RLS Policies.

### 2. Environment Variables
Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # For Admin actions
XENDIT_SECRET_KEY=your_xendit_secret_key
XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token
```

### 3. Run Locally

```bash
npm install
npm run dev
```

## 📄 License
Public Repository.
