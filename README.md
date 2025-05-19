### 🧠 Unified Auth Flow for Individuals and Organization

Rather than building multiple isolated login systems, this design supports a unified authentication flow that adapts to different user types based on their email domain.

The core logic revolves around checking the domain of the authenticated user’s email. This allows the system to branch behavior intelligently:

| User Type                  | Login Options           | Org Detection Logic                                |
| -------------------------- | ----------------------- | -------------------------------------------------- |
| 🧝 Individual user         | Email or Google login   | Email domain is **not in registry**                |
| 🏢 Org member (no IdP)     | Email or Google login   | Email domain **is** in registry; `usesSSO = false` |
| 🏢 Org member (Google SSO) | Google login (prebuilt) | Email domain **is** in registry; `usesSSO = true`  |

This architecture:

- ✅ Supports both individual and enterprise onboarding
- ✅ Aligns with real-world SaaS identity evolution
- ✅ Centralizes logic around one domain registry, reducing complexity
- ✅ Makes the product SSO-ready with minimal friction

---

### 💡 Additional Sections to Consider for README

- **Project Overview**
- **Supported Login Flows**
- **Org Detection Logic**
- **Auth Strategy Overview** (Google ID token + Supabase + optional nonce)
- **Tech Stack**
- **Run Locally / Deploy**
- **What I’d Build Next** (great for async reviewers)

TODO: Update this file

1.  Navigate to Google Workspace Apps: https://workspace.google.com/dashboard
2.  Select krea-sso-demo
3.      •	What’s SAML SSO?

    SAML is an XML-based standard for single sign-on. It allows Google Workspace (our IdP) to authenticate users and send a secure assertion to our backend (Supabase) to log them in.
    • What’s the IdP-initiated flow?
    This flow begins in the Identity Provider (Google). When a user clicks the app in their workspace, it sends a SAML assertion directly to Supabase’s Auth server — no action from the frontend required.
    • What happens after the SAML assertion is received?
    Supabase creates the user and redirects them back to your app. In your SvelteKit project, the +layout.server.ts picks up the session and gives them access to the dashboard.
