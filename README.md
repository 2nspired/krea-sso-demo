# Unified Auth Flow for Individuals and Organizations

This project demonstrates a unified authentication system in SvelteKit, powered by Supabase Auth. It supports both individual users and organizations, enabling Single Sign-On (SSO) via Google Workspace. The login flow intelligently adapts based on the user's email domain—automatically routing organization users to SSO and allowing standard login for individuals. This approach provides seamless onboarding for SaaS and enterprise use cases, and highlights best practices for handling identity management and account duplication challenges when integrating SSO with Supabase.

---

## Project Overview

- **Goal:** Provide a single, flexible authentication flow for both individuals and organizations.
- **Key Feature:** Domain-based logic determines whether a user gets standard login or is routed through SSO.

---

## Supported Login Flows

Note: In this demo, I utilize a domain to determine if they are SSO. This could be adjusted to check if a user is part of a team or other conditional logic.

| User Type               | Login Options           | Org Detection Logic                                |
| ----------------------- | ----------------------- | -------------------------------------------------- |
| Individual user         | Email or Google login   | Email domain is **not in registry**                |
| Org member (no IdP)     | Email or Google login   | Email domain **is** in registry; `usesSSO = false` |
| Org member (Google SSO) | Google login (prebuilt) | Email domain **is** in registry; `usesSSO = true`  |

---

## Org Detection Logic

- On login, the backend checks the user's email domain against a organization registry.
- If the domain is registered and `usesSSO` is true, the user is redirected to the SSO flow.
- Otherwise, standard email/Google login is offered.

⚠️ Google OAuth does not expose the email until after the user is created, which prevents domain-based pre-checks. This requires a separate post-auth hook if you want to enforce domain restrictions.

⚠️ User accounts and identities created via SSO differ from regular (email, phone, password, social login...) accounts in these ways:

- No automatic linking. Each user account verified using a SSO identity provider will not be automatically linked to existing user accounts in the system. That is, if a user valid.email@supabase.io had signed up with a password, and then uses their company SSO login with your project, there will be two valid.email@supabase.io user accounts in the system.

- Emails are not necessarily unique. Given the behavior with no automatic linking, email addresses are no longer a unique identifier for a user account. Always use the user's UUID to correctly reference user accounts.

---

## Auth Strategy Overview

- **Google SSO:** Uses SAML assertions from Google Workspace as the Identity Provider (IdP).
- **Supabase Auth:** Handles user creation and session management.
- **Session Pickup:** After SSO, Supabase redirects to the app, where SvelteKit's `+layout.server.ts` picks up the session.

---

## Tech Stack

- **Frontend:** SvelteKit, TailwindCSS
- **Backend/Auth:** Supabase Auth (with SAML SSO support)
- **SSO Provider:** Google Workspace (SAML), OKTA (SAML)
- **Other:** TypeScript, Vite

---

## Enable SSO (Supabase)

This will enable SSO for your project and is the starting point for setting up IdP-initiated SSO logins.
This assumes you have properly followed the instructions for [Setting up Server-Side Auth for SvelteKit](https://supabase.com/docs/guides/auth/server-side/sveltekit)

1. Authentication / Sign in / Providers, Select SAML 2.0
2. Install and utilize the Supabase CLI (required for SSO setup) to add connections/auth providers. More details can be found in the documentation: [Single Sign-On with SAML 2.0 for Projects](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml#important-saml-20-information). This documentation will be referenced throughout so keep it handy.

## SSO Setup (Google Workspace)

This will outline how to setup your google workspace as an IdP and add a custom app to integrate with your supabase project. Note: all routing will be handled in your project, primarily hooks.server.ts.

1. Go to [Google Workspace Apps](https://workspace.google.com/dashboard)
2. Make sure you logged in as admin and go to: Apps / Web and mobile apps > add app > _add custom SAML app_
3. Give your app a name, description and icon > _continue_
4. Download the metadata, enable it and leave SAML metadata URL empty and allow encrypted assertions. Google does not support a metadata url (which is ideal so they remain in sync regardless of changes, if something breaks this would be the first place to look).
5. Add Supabase service provider details, this is outlined by Supabase and can be found in [Important SAML 2.0 Information](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml#important-saml-20-information)
6. Add the following:

| Field          | Value                             |
| -------------- | --------------------------------- |
| ACS URL        | Supabase ACS URL                  |
| Entity ID      | Supabase EntityID                 |
| Name ID format | Email                             |
| Name ID        | Basic Information > Primary email |

7. Map google directory attributes to the below mapping, there were issues initially which is why I am using the templates to map, see map below:
8. Follow the documentation for Supabase: [Managing SAML 2.0 connections](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml#managing-saml-20-connections)
9. Test, and test again. Attributes aligning can be a pain, see **SAML 2.0 Troubleshooting** below for tools that can help with this, but the mapping provided below will get you the basics to map with the basic Supabase user.

**Google Workspace Attribute Mapping:**
_Note:_ Google Workspace SAML SSO does not support passing profile image url as an attribute like you can obtain when using google Oauth. This would require a second request via another workspace service to obtain.

```json
{
	"keys": {
		"email": {
			"name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
		},
		"first_name": {
			"name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
		},
		"last_name": {
			"name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
		},
		"phone": {
			"name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/telephoneNumber"
		}
	}
}
```

## SSO Setup (Okta)

This will enable SSO for your project and is the starting point for setting up IdP-initiated SSO logins.

1. Go to your Okta developer dashboard / Applications > _Create App Integration_
2. Select _SAML 2.0_ > Add your app details and continue
3. Add the following:

**SAML Settings**

| Okta Field                     | Supabase Value    |
| ------------------------------ | ----------------- |
| Single sign-on URL             | Supabase ACS URL  |
| Audience URI (SP Entity ID)    | Supabase EntityID |
| Name ID format                 | EmailAddress      |
| Application username           | Email             |
| Update application username on | Create and update |

**Attribute Statements**

| Name       | Name format (optional) | Value            |
| ---------- | ---------------------- | ---------------- |
| email      | Basic                  | user.email       |
| first_name | Basic                  | user.firstName   |
| last_name  | Basic                  | user.lastName    |
| phone      | Basic                  | user.mobilePhone |

4. Copy the metdata URL from Okta. This will be used when creating a new connection.
5. Add Supabase service provider details, this is outlined by Supabase and can be found in [Important SAML 2.0 Information](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml#important-saml-20-information)
6. Follow the documentation for Supabase: [Managing SAML 2.0 connections](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml#managing-saml-20-connections)
7. Test, and test again. Attributes aligning can be a pain, see **SAML 2.0 Troubleshooting** below for tools that can help with this, but the mapping provided below will get you the basics to map with the basic Supabase user.

**Okta Attribute Mapping:**
_Note:_ You can map to many fields, anything that doesn't directly map will be contained as an object in the auth/users/raw_user_meta_data. This could be useful for building a profile which would ideally maintain the same id as the users uuid in the auth table.

```json
{
	"keys": {
		"email": {
			"name": "email"
		},
		"first_name": {
			"name": "first_name"
		},
		"last_name": {
			"name": "last_name"
		},
		"phone": {
			"name": "phone"
		}
	}
}
```

---

## Build Considerations

- **Admin UI** for managing org domains and SSO settings.
- **Team/Role support** for finer-grained access control.
- **Audit logging** for SSO events.
- **More IdP options** (Okta, Azure AD, etc).
- **End-to-end tests** for SSO and fallback flows.

---

## References

1. **Supabase**

- [Supabase: SSO with SAML 2.0](https://supabase.com/docs/guides/auth/enterprise-sso/auth-sso-saml)
- [Supabase: Setting up Server-Side Auth for SvelteKit](https://supabase.com/docs/guides/auth/server-side/sveltekit)

2. **Google Workspace**

- [Google Workspace: Set up SSO with Google as your IdP](https://support.google.com/a/topic/7556794?hl=en&ref_topic=7556686&sjid=15853432609496105236-NC)

3. **Helpful Supabase CLI Commands**

- `$COMMAND supabase sso list --project-ref <project id, found in project/settings>`
  This list will only include basic information about each provider.

- `$COMMAND supabase sso show 123857fd-4f15-45bc-99aa-8f8315bc7214 \ --project-ref <project id, found in project/settings>`
  This command will pull the sso_config, and outline the Attribute Mapping and SAML Metadata, note you can only utilize Supabase CLI to config your project for SSO. This is helpful troubleshooting mapping issues.

- `$COMMAND supabase sso update <sso_provider (sso provider id, found in tables/schema:auth/sso_providers/id)> \ --project-ref <project id, found in project/settings> \ --attribute-mapping-file <file path>`
  this command will update the attribute mappings based on a .json mapping file you specify if you need to make changes.

4. **SAML 2.0 Troubleshooting**
   Mapping can be a pain, [SAML-tracer](https://chromewebstore.google.com/detail/saml-tracer/mpdajninpobndbfcldcmbpnnbhibjmch?hl=en_) for google chrome is really helpful for identifying mapping issues. Just start the tool, follow your paths and it will reveal the SAML file and you can validate mappings.

---

## License

MIT

---
