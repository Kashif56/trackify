```markdown
# 📄 Product Requirements Document (PRD)
**Product Name (working):** Trackify (Invoice & Expense Tracker SaaS)  
**Version:** MVP 1.0  
**Prepared by:** Kashif Mehmood  
**Date:** 11th September 2025  

---

## 1. 🎯 Purpose
A simple and affordable **Invoice & Expense Tracking SaaS** targeted at freelancers, small businesses, and home-based entrepreneurs who find existing tools (like QuickBooks, FreshBooks) too complex or expensive.  

Users should be able to:  
- Create & send invoices.  
- Track expenses.  
- View simple reports.  
- Upgrade to paid plans for advanced features.  

---

## 2. 📌 Goals & Non-Goals

### Goals
- Build a **web app** with **Django REST API** + **React frontend**.  
- Deliver **core features quickly** (MVP focus).  
- Support **scalable SaaS model** (Free vs Pro plans).  
- UX: **simple, clean, mobile-friendly**.  

### Non-Goals (MVP)
- No mobile app (yet).  
- No multi-currency or advanced tax handling.  
- No automation (recurring invoices) in v1.  

---

## 3. 👥 Target Users
- **Freelancers** (2–10 invoices/month).  
- **Small shops/service providers** (electricians, tutors, tailors).  
- **Micro businesses** (food sellers, home-based entrepreneurs).  

Pain Points:  
- Need **basic tracking** without accounting jargon.  
- Can’t afford expensive tools.  
- Want **quick setup, no training**.  

---

## 4. 🔑 Features

### 4.1 MVP Features
1. **Auth & User Management**
   - Email/password signup & login (JWT).  
   - Forgot/reset password.  
   - Profile management.  

2. **Invoices**
   - Create invoice (logo, client details, items, price).  
   - View invoice (with PDF export).  
   - Edit/delete invoice.  
   - Status: Paid, Unpaid, Overdue.  

3. **Expenses**
   - Add expense (date, amount, category).  
   - Edit/delete expense.  
   - View expense list.  

4. **Dashboard**
   - Show totals: Income, Expense, Balance.  
   - Quick stats cards.  

5. **Reports**
   - Monthly income vs expense chart.  
   - Export report (PDF/CSV).  

6. **Clients**
   - Save client details (name, email, phone).  
   - View invoices by client.  

7. **Subscription (Basic SaaS Logic)**
   - Free Plan → Max 3 invoices/month.  
   - Pro Plan → Unlimited invoices, expense reports.  
   - Business Plan (later) → Multi-user, advanced reports.  

---

## 5. 🖥️ Tech Stack

### Backend (API Layer)
- **Framework:** Django REST Framework  
- **Database:** PostgreSQL  
- **Auth:** JWT (SimpleJWT)  
- **Deployment:** DigitalOcean / Railway / Heroku  

### Frontend
- **Framework:** React.js  
- **State Management:** Redux Toolkit  
- **Routing:** React Router v6  
- **UI:** TailwindCSS + shadcn/ui (for consistency)  
- **Icons:** lucide-react  
- **Notifications:** React-Toastify  
- **Charts:** Recharts (for reports)  

---

## 6. 📂 Pages & Routes

### Public (Unauthenticated)
- `/` → Landing page (simple for MVP)  
- `/login` → Login page  
- `/register` → Signup page  
- `/forgot-password` → Reset password  

### Private (Authenticated Dashboard)
- `/dashboard` → Stats overview  
- `/invoices` → List invoices  
- `/expenses` → List expenses  
- `/clients` → List clients  
- `/reports` → Charts + export  
- `/settings` → Profile, company info, subscription  

---

## 7. 🎨 UI/UX Notes
- **Clean, minimal dashboard** (white background, Tailwind cards, Lucide icons).  
- **Toast messages** for success/errors (e.g., “Invoice created successfully”).  
- **Dark mode** (optional in later versions).  

---

## 8. 💰 Monetization
- Free Plan (3 invoices/month).  
- Pro Plan ($10/month, unlimited).  
- Business Plan ($20/month, multi-user).  
- Stripe integration for subscription billing (Phase 2).  

---

## 9. ⚠️ Risks & Mitigations
- **Competition** → Differentiate by *simplicity & low cost*.  
- **Adoption** → Validate demand with landing page + waitlist before full build.  
- **Payments in South Asia** → Use Stripe + fallback (2Checkout/Payoneer).  

---

## 10. ✅ Success Metrics
- 1000 registered users within 6 months.  
- At least 10% conversion to Pro Plan.  
- Churn rate < 10% after 3 months.  
- Positive feedback on UX simplicity.  

---
```
