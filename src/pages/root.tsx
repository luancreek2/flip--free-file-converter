import { randomInt } from "node:crypto";

import { JWTPayloadSpec } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";

import { BaseHtml } from "../components/base";
import { ConverterHome } from "../components/converterHome";
import { Header } from "../components/header";
import db from "../db/db";
import { User } from "../db/types";
import {
  ACCOUNT_REGISTRATION,
  ALLOW_UNAUTHENTICATED,
  BRANDING,
  HIDE_HISTORY,
  HTTP_ALLOWED,
  UNAUTHENTICATED_USER_SHARING,
  WEBROOT,
} from "../helpers/env";
import { FIRST_RUN, userService } from "./user";

export const root = new Elysia().use(userService).get(
  "/",
  async ({ jwt, redirect, cookie: { auth, jobId } }) => {
    if (!ALLOW_UNAUTHENTICATED) {
      if (FIRST_RUN) {
        return redirect(`${WEBROOT}/setup`, 302);
      }

      if (!auth?.value) {
        return redirect(`${WEBROOT}/login`, 302);
      }
    }

    // validate jwt
    let user: ({ id: string } & JWTPayloadSpec) | false = false;
    if (ALLOW_UNAUTHENTICATED) {
      // Check if the current cookie is already a valid session
      if (auth?.value) {
        try {
          const verifiedUser = await jwt.verify(auth.value);
          if (verifiedUser && verifiedUser.id) {
            const numericId = Number.parseInt(verifiedUser.id);
            // IDs below the anonymous range (excluding shared 0) are registered users
            const isRegistered = numericId > 0 && numericId < 2 ** 24;
            if (
              !isRegistered ||
              db.query("SELECT * FROM users WHERE id = ?").as(User).get(verifiedUser.id)
            ) {
              user = verifiedUser;
            }
          }
        } catch {
          // Invalid cookie, fall through to anonymous creation
        }
      }

      // If no valid session found, create an anonymous user
      if (!user) {
        const newUserId = String(
          UNAUTHENTICATED_USER_SHARING
            ? 0
            : randomInt(2 ** 24, Math.min(2 ** 48 + 2 ** 24 - 1, Number.MAX_SAFE_INTEGER)),
        );
        const accessToken = await jwt.sign({
          id: newUserId,
        });

        user = { id: newUserId };

        // Use existing cookie if it exists, otherwise set a new one
        if (auth) {
          auth.set({
            value: accessToken,
            httpOnly: true,
            secure: !HTTP_ALLOWED,
            maxAge: 24 * 60 * 60,
            sameSite: "strict",
          });
        } else {
          return {
            message: "No auth cookie, perhaps your browser is blocking cookies.",
          };
        }
      }
    } else if (auth?.value) {
      user = await jwt.verify(auth.value);

      if (
        user !== false &&
        user.id &&
        (Number.parseInt(user.id) < 2 ** 24 || !ALLOW_UNAUTHENTICATED)
      ) {
        // Make sure user exists in db
        const existingUser = db.query("SELECT * FROM users WHERE id = ?").as(User).get(user.id);

        if (!existingUser) {
          if (auth?.value) {
            auth.remove();
          }
          return redirect(`${WEBROOT}/login`, 302);
        }
      }
    }

    if (!user) {
      return redirect(`${WEBROOT}/login`, 302);
    }

    // create a new job
    db.query("INSERT INTO jobs (user_id, date_created) VALUES (?, ?)").run(
      user.id,
      new Date().toISOString(),
    );

    const { id } = db
      .query("SELECT id FROM jobs WHERE user_id = ? ORDER BY id DESC")
      .get(user.id) as { id: number };

    if (!jobId) {
      return { message: "Cookies should be enabled to use this app." };
    }

    jobId.set({
      value: id,
      httpOnly: true,
      secure: !HTTP_ALLOWED,
      maxAge: 24 * 60 * 60,
      sameSite: "strict",
    });

    console.log("jobId set to:", id);

    return (
      <BaseHtml webroot={WEBROOT}>
        <>
          <Header
            webroot={WEBROOT}
            branding={BRANDING}
            accountRegistration={ACCOUNT_REGISTRATION}
            allowUnauthenticated={ALLOW_UNAUTHENTICATED}
            hideHistory={HIDE_HISTORY}
            loggedIn
          />
          <ConverterHome webroot={WEBROOT} allowUnauthenticated={ALLOW_UNAUTHENTICATED} />
          <script src={`${WEBROOT}/script.js`} defer />
        </>
      </BaseHtml>
    );
  },
  {
    cookie: t.Cookie({
      auth: t.Optional(t.String()),
      jobId: t.Optional(t.String()),
    }),
  },
);
