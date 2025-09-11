---
trigger: always_on
---

# 📋 Coding & Product Management Rules - Trackify SaaS

## 1. General Principles
- Always prioritize **MVP scope**. Avoid adding features not listed in the PRD.
- AI outputs should be **checked for accuracy**, no assumptions about business logic.
- Maintain **clean, readable, and modular code**.
- Follow **DRY (Don’t Repeat Yourself)** and **KISS (Keep It Simple, Stupid)** principles.
- Every feature should **serve the core user pain points** outlined in the PRD.
- use snake_case for variables names

---

## 2. Backend (Django REST Framework)
- Use **JWT (SimpleJWT)** for authentication.
- API endpoints must follow **REST conventions**:
  - GET → fetch data
  - POST → create new
  - PUT/PATCH → update existing
  - DELETE → remove resource
- Include **pagination** for lists (`/invoices`, `/expenses`, `/clients`) to optimize performance.
- Use **serializers** for input validation.
- Do **not** include unnecessary fields in API responses.
- All endpoints must have **error handling** and return proper HTTP status codes.
- AI should **never invent new endpoints** outside the PRD unless explicitly approved.

---

## 3. Frontend (React.js + Redux Toolkit)
- State must be managed **using Redux Toolkit slices**.
- Routing should use **React Router**.
- UI should be **consistent**: TailwindCSS, Lucide-react icons, React-Toastify for notifications.
- Forms must have **client-side validation**.
- API calls must handle **loading, success, and error states**.
- Dashboard pages should **only show authenticated content**.
- Do **not create extra pages/components** outside the page list in the PRD.
- AI should **not assume UI patterns** not defined in PRD unless clarified.

---

## 4. UX & Product Rules
- Users can **create clients inline** when creating invoices; client-first flow is optional.
- Dashboard must always **show total income, total expense, balance** clearly.
- Reports must reflect **real data from invoices and expenses**.
- Free plan limitations must be **enforced in the frontend and backend**.
- Payment integration should only be implemented after **Stripe/PayPal approval**.
- Any new feature must have **explicit validation by product manager** before development.

---

## 5. Coding Standards
- Follow **PEP8** for Python and **ESLint + Prettier** for JavaScript.
- Use **descriptive variable, function, and component names**.
- Write **inline comments** for complex logic.




## 8. AI Usage Rules
- AI must **only work within PRD scope**.
- Never hallucinate features, endpoints, or flows outside the approved list.
- Always **flag uncertainty** instead of assuming behavior.
- Generated code must **be verified** by a human developer.
- Always reference PRD, page list, and coding standards before generating new content.

---
---

## 10. Documentation
- Every feature/component must have **documentation in Markdown**.
- Inline comments and README updates are mandatory.
- PRD, page list, and coding rules are the **source of truth** for AI and devs.