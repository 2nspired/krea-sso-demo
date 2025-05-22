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

---

XX OTHER NOTES

1. Consideration: If a user has a login of SSO with the email you will need a way to flag that account and redirect to IdP dashboard or not allow user to create a separate account with email if already used. Supabase will still allow a second account with that same email and they will be treated as separate user auth records.

$COMMAND
supabase sso update 123857fd-4f15-45bc-99aa-8f8315bc7214 \
 --project-ref jizuyubnzxoaevkmpphy \
 --attribute-mapping-file ~/Desktop/okta-attribute-mapping.json

| PROPERTY             | VALUE                                                                    |
| -------------------- | ------------------------------------------------------------------------ |
| IDENTITY PROVIDER ID | 123857fd-4f15-45bc-99aa-8f8315bc7214                                     |
| TYPE                 | SAML 2.0                                                                 |
| DOMAINS              | ttrud.com                                                                |
| SAML 2.0 METADATA    | https://dev-47066930.okta.com/app/exkouok426aQK0VsN5d7/sso/saml/metadata |
| SAML 2.0 EntityID    | http://www.okta.com/exkouok426aQK0VsN5d7                                 |
| CREATED AT (UTC)     | 2025-05-22 01:03:04                                                      |
| UPDATED AT (UTC)     | 2025-05-22 01:03:04                                                      |

## Attribute Mapping

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

## SAML 2.0 Metadata XML

      <?xml version="1.0" encoding="UTF-8"?>
      <md:EntityDescriptor entityID="http://www.okta.com/exkouok426aQK0VsN5d7" xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata">
        <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
          <md:KeyDescriptor use="signing">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
              <ds:X509Data>
                <ds:X509Certificate>MIIDqDCCApCgAwIBAgIGAZb1e4KFMA0GCSqGSIb3DQEBCwUAMIGUMQswCQYDVQQGEwJVUzETMBEG
    A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU
    MBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi00NzA2NjkzMDEcMBoGCSqGSIb3DQEJ
    ARYNaW5mb0Bva3RhLmNvbTAeFw0yNTA1MjIwMDUyNTRaFw0zNTA1MjIwMDUzNTRaMIGUMQswCQYD
    VQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsG
    A1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi00NzA2NjkzMDEc
    MBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
    ggEBAOJnaFtbKNpHNIomQth2sdpEt27HO2XN5vhGhKTkfVa0orM4qOfdSs6xLLSSHa8SvW7EOR33
    CpH5YYPU90zAoVCcAoPyEknB0WLk5leQphmyVUCv8fbmQYHtvVSgWbwOjUNKMoYowo4mr00Rak93
    +k7UjwVFa5QJt3nEVmiv1nhwKIsq3TiJxn12lUbQHm6amd9Y00Aw197s00rlpaX52DN0QAQbG8fk
    NnPydpXIIR3n5JtLRDvmyuOZSG0jM4TEji2Zwecli2QFAZeNLVI5KE926JzvRpQVp9t6rBcgDtm3
    j2wkr8BLyVw1TQVRME9FbxfbUWDapsaq/N7Vdn17iW0CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEA
    bdXtm8ASx1yGh2TIkNgRkiPrSzX+r3buQs6ky1vgJ38RwNg35ZRZ4ZdNwYlFGoTJhdShGa/aL7hW
    0Mdk48Jk67GAsR9jxJS53biudmF6Mg6dIzDbIJAR0xXo4b1Q5lCUU94red8r9GQ3+XqHZ7TQE3Ye
    OMWC96spH6HxozScMnDVDLchscR8I2fMsxPRXVjdfHi/8u/rxYTE/nezJgAmnV70t0uCiAc4Pj+e
    h7V6bo6UzKPCQRDvWp/11VuqzRlidMPew33RY2WcF2juCaWwTBFqsGe/c2aIRT5Y6CO9JjBhMmEv
    rLtwzwIH2S+42xOsYI+vKKewIrUPSeJQq92HUw==</ds:X509Certificate>
              </ds:X509Data>
            </ds:KeyInfo>
          </md:KeyDescriptor>
          <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</md:NameIDFormat>
          <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://dev-47066930.okta.com/app/dev-47066930_kreassodemo_1/exkouok426aQK0VsN5d7/sso/saml"/>
          <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://dev-47066930.okta.com/app/dev-47066930_kreassodemo_1/exkouok426aQK0VsN5d7/sso/saml"/>
        </md:IDPSSODescriptor>
      </md:EntityDescriptor>

$COMMAND
supabase sso show 123857fd-4f15-45bc-99aa-8f8315bc7214 \
 --project-ref jizuyubnzxoaevkmpphy
