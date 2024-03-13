import { cookies } from "next/headers";
import { google, OAuth2RequestError } from "@millennicare/auth";
import { db, eq, schema } from "@millennicare/db";

import { createSession } from "~/app/lib/auth";

interface GoogleUser {
  sub: string;
  email: string;
  verified?: boolean;
}

/**
This functions checks if the user exists in the database.
If the user exists, check for 2 conditions
- if the user exists with google in the accounts table, create a session
- if the user exists without google in the accounts table, link the account with the existingUser.id
If the user does not exist, throw an error saying they must register first
*/
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 400,
      headers: {
        Location: "/sign-in?oauth_error=true",
      },
    });
  }
  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    // eslint-disable-next-line
    const googleUser: GoogleUser = await response.json();
    console.log(googleUser);
    const existingUser = await db.query.userTable.findFirst({
      where: eq(schema.userTable.email, googleUser.email),
    });

    // if the user exists, create a session
    if (existingUser) {
      console.log("User exists, checking for existing account.");
      // check first if account table has the existingUser.id
      // if not, link account with the existingUser.id

      await db
        .insert(schema.accountTable)
        .values({
          providerId: "google",
          providerUserId: googleUser.sub,
          userId: existingUser.id,
        })
        .onConflictDoNothing();

      await createSession(existingUser.id);
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard" },
      });
    }

    return new Response(null, {
      status: 404,
      headers: { Location: "/sign-in" },
    });
  } catch (error) {
    console.error(error);
    // the specific error message depends on the provider
    if (error instanceof OAuth2RequestError) {
      // invalid code

      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, { status: 500 });
  }
}
