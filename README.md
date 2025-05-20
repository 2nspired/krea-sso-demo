# 🧠 Unified Auth Flow for Individuals and Organizations

This project demonstrates a unified authentication system in SvelteKit, supporting both individual users and organizations with SSO (Single Sign-On) via Google Workspace. The login flow adapts based on the user's email domain, enabling seamless onboarding for SaaS and enterprise use cases.

---

## 🚀 Project Overview

- **Goal:** Provide a single, flexible authentication flow for both individuals and organizations.
- **Key Feature:** Domain-based logic determines whether a user gets standard login or is routed through SSO.

---

## 🔑 Supported Login Flows

Note: In this demo, I utilize a domain to determine if they are SSO. This could be adjusted to check if a user is part of a team or other conditional logic.

| User Type                  | Login Options           | Org Detection Logic                                |
| -------------------------- | ----------------------- | -------------------------------------------------- |
| 🧝 Individual user         | Email or Google login   | Email domain is **not in registry**                |
| 🏢 Org member (no IdP)     | Email or Google login   | Email domain **is** in registry; `usesSSO = false` |
| 🏢 Org member (Google SSO) | Google login (prebuilt) | Email domain **is** in registry; `usesSSO = true`  |

Note: For the sake of speed and purpose of the demo, email account creation flow was not added since primary purpose was to demonstrate SSO integration.

---

## 🏢 Org Detection Logic

- On login, the backend checks the user's email domain against a organization registry.
- If the domain is registered and `usesSSO` is true, the user is redirected to the SSO flow.
- Otherwise, standard email/Google login is offered.

Note: For demo purposes and speed, I only check against the registry if the user attempts to login with an email. A check for the google Oauth login does not have the check implemented.

---

## 🔒 Auth Strategy Overview

- **Google SSO:** Uses SAML assertions from Google Workspace as the Identity Provider (IdP).
- **Supabase Auth:** Handles user creation and session management.
- **Session Pickup:** After SSO, Supabase redirects to the app, where SvelteKit's `+layout.server.ts` picks up the session.

---

## 🛠️ Tech Stack

- **Frontend:** SvelteKit, TailwindCSS
- **Backend/Auth:** Supabase Auth (with SAML SSO support)
- **SSO Provider:** Google Workspace (SAML)
- **Other:** TypeScript, Vite

---

## 🏃‍♂️ Run Locally / Deploy

1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd krea-sso-demo
   npm install
   ```
2. Set up your `.env` file (see `.env.example` if available).
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Configure your Supabase project and Google Workspace SAML app as described below.

Note: To support SSO, Supabase requires a pro plan.

---

## 🔗 SSO Setup (Google Workspace)

1. Go to [Google Workspace Apps](https://workspace.google.com/dashboard)
2. Select your app (e.g., "krea-sso-demo")
3. Configure SAML SSO:

   - **SAML** is an XML-based standard for single sign-on. Google Workspace (IdP) authenticates users and sends a secure assertion to Supabase.
   - **IdP-initiated flow:** User clicks the app in Google Workspace, which sends a SAML assertion to Supabase Auth. No frontend action required.
   - **After SAML assertion:** Supabase creates the user and redirects to your app. The SvelteKit backend picks up the session and grants access.

   Note: Google Workspace SAML SSO does not support passing profile image url as an attribute like you can obtain when using google Oauth. This would require a second request via another workspace service to obtain.

---

## 📝 What I'd Build Next

- **Admin UI** for managing org domains and SSO settings.
- **Team/Role support** for finer-grained access control.
- **Audit logging** for SSO events.
- **More IdP options** (Okta, Azure AD, etc).
- **End-to-end tests** for SSO and fallback flows.

---

## 📄 References

1. **Supabase**

- [Supabase: SSO with SAML 2.0](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml)
- [Supabase: Setting up Server-Side Auth for SvelteKit](https://supabase.com/docs/guides/auth/server-side/sveltekit)

2. **Google Workspace**

- [Google Workspace: Set up SSO with Google as your IdP](https://support.google.com/a/topic/7556794?hl=en&ref_topic=7556686&sjid=15853432609496105236-NC)

---

## 📄 License

MIT
