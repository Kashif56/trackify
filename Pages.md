```markdown
# 📄 Page List - Ledgerly (Invoice & Expense Tracker SaaS)

---

## 1. Public Pages (Unauthenticated)

| Page | Purpose |
|------|---------|
| `/` | Landing Page - Marketing, features, pricing, call-to-action to register/login |
| `/login` | User login |
| `/register` | Signup / plan selection |
| `/forgot-password` | Reset password via email |
| `/pricing` | Detailed pricing & plan comparison |
| `/features` | Highlight key features of the product |
| `/contact` | Contact/support form (optional for MVP) |

---

## 2. Authenticated Pages (Dashboard App)

### Dashboard

| Page | Purpose |
|------|---------|
| `/dashboard` | Quick overview: total income, total expense, balance, pending invoices |

### Invoices

| Page | Purpose |
|------|---------|
| `/invoices` | List of all invoices (filters: paid, unpaid, overdue), Add and Edit Invoice Modals |
| `/invoices/:id` | View invoice details + PDF export + mark as paid |


### Expenses

| Page | Purpose |
|------|---------|
| `/expenses` | List of all expenses (filters by category, date), Add and Edit Expense Modals 

### Clients

| Page | Purpose |
|------|---------|
| `/clients` | List of clients with total invoices, outstanding payments |
| `/clients/:id` | View client details, linked invoices, edit client |

### Reports

| Page | Purpose |
|------|---------|
| `/reports` | Income vs expense charts, monthly summary, download/export PDF/CSV |

### Payments / Billing

| Page | Purpose |
|------|---------|
| `/subscription` | Current plan, upgrade/downgrade options |
| `/billing-history` | Payment history for SaaS subscription |
| `/payment-method` | Add/update credit card / payment gateway info |

### Settings

| Page | Purpose |
|------|---------|
| `/settings/profile` | Update email, password, personal info |
| `/settings/company` | Update company name, logo, address (used in invoices) |
| `/settings/notifications` | Payment reminders, invoice notifications, alerts |

---

## ⚡ UX Notes
- Most “new” pages (create invoice/expense/client) can appear as **modal forms** instead of full-page navigation for a smoother workflow.  
- Tabs in `/dashboard` can give **quick links** to invoices, expenses, clients, and reports.
```
