---
trigger: model_decision
description: Use this rule when you are creating frontend components
---

```markdown
# 🎨 UI/UX Guidelines - Ledgerly (Invoice & Expense Tracker SaaS)

---

## 1. 🎯 Design Philosophy
- **Simplicity first:** Minimalistic layout, clean dashboards, no clutter.
- **User-centric:** All actions should be intuitive, fast, and easy to understand.
- **Consistency:** Use consistent colors, fonts, spacing, and UI elements across all pages.
- **Responsive:** Fully responsive for desktop, tablet, and mobile.
- **Visual hierarchy:** Important information (income, expense, balance, unpaid invoices) should be immediately visible on the dashboard.
- **Feedback oriented:** Provide instant feedback with toast messages for all user actions.
- **Scalable:** Design should accommodate future features (recurring invoices, multi-user, multi-currency) without redesign.

---

## 2. 🎨 Color Theme
| Color | Usage | Hex |
|-------|-------|-----|
| Primary Orange | Buttons, links, highlights | #F97316 |
| Accent Green | Dashboard cards, stats | #22C55E |
| Neutral Light Gray | Backgrounds, borders, forms | #F9FAFB |
| Dark Gray | Text primary | #1F2937 |
| Medium Gray | Text secondary, placeholders | #4B5563 |
| Error Red | Errors, invalid fields | #EF4444 |
| Success Green | Success messages, confirmations | #10B981 |
| Warning Yellow | Alerts, pending actions | #FBBF24 |

**Notes:**
- Use **primary orange** for call-to-action buttons.
- Use **accent green** for money-related stats and positive feedback.
- Neutral backgrounds to reduce visual clutter.
- Toast messages use green for success, red for errors, yellow for warnings.

---

## 3. 🖋 Font and Typography
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|------------|
| Headings (H1) | Inter | 32px | 700 | 40px |
| Subheadings (H2/H3) | Inter | 24px | 600 | 32px |
| Body Text | Inter | 16px | 400 | 24px |
| Small Text / Labels | Inter | 14px | 400 | 20px |
| Buttons | Inter | 16px | 600 | 24px |

**Notes:**
- Font **Inter** for modern, clean look.
- Maintain consistent font sizes for readability.
- Bold headings for important sections, regular for body text.

---

## 4. 🖌 Component Design
- **Buttons:** Rounded corners (6px), primary orange for main actions, hover: darken 10%.
- **Cards:** Soft shadows, white background, rounded corners (8px), padding consistent (16px).
- **Forms:** Input fields with light gray borders, focus: primary orange outline, error: red outline.
- **Tables:** Alternate row colors light gray, sortable headers, responsive scroll for mobile.
- **Modals:** Centered, dark overlay background, smooth open/close animations.
- **Charts:** Simple, clean, minimal legends, primary orange & accent green colors for charts.
- **Icons:** lucide-react, consistent sizing, semantically meaningful.
- **Notifications:** Toastify, top-right position, auto-hide after 3-5s.

---

## 5. 🖥 Layout Guidelines
- **Dashboard:** 3–4 stat cards on top, main content area below.
- **Side navigation:** Collapsible sidebar for desktop, bottom tab bar for mobile (if needed later).
- **Forms:** Inline labels, proper spacing (16px margin/padding), submit buttons fixed to bottom if modal.
- **Responsive breakpoints:**
  - Mobile: 0–640px
  - Tablet: 641–1024px
  - Desktop: 1025px+

---

## 6. UX Guidelines
- Use **inline validation** for forms.
- Confirmation modals for destructive actions (delete invoice/client).
- Highlight important statuses: Paid (green), Unpaid (red), Overdue (orange).
- Auto-focus first input in modals for fast data entry.
- Use **consistent icons** from lucide-react for edit, delete, add, view, download actions.
- Minimize clicks for frequent tasks (creating invoices, adding expenses).

---

## 7. Accessibility
- Ensure **sufficient color contrast** (WCAG AA standard).
- All buttons and links must be **keyboard navigable**.
- Use **ARIA labels** for modals, forms, and icons.
- Toast messages accessible to screen readers.

---

## 8. File Naming & Component Guidelines
- Use **kebab-case** for file names: `invoice-list.jsx`, `expense-card.jsx`.
- Components should be **small and reusable**.
- Keep **logic separated from presentation** (container vs component pattern).
- Use **Redux slices** for state management per module: invoicesSlice, expensesSlice, clientsSlice.

---

## 9. Animations & Micro-interactions
- Subtle hover effects on buttons and cards.
- Smooth opening/closing of modals (fade + slide up). 
- Toast messages slide from top-right.
- Chart animations on load (optional, subtle).

---

**Note:** All design decisions are **aligned with MVP simplicity**, clean dashboard, fast user workflows, and easy future scalability.
```
