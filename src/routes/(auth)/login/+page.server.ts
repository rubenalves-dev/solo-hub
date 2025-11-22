import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schemas';
import { loginSchema } from '$lib/validation/auth.schema';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }
  const authForm = await superValidate(zod4(loginSchema));
  return { authForm };
};

export const actions: Actions = {
  login: async (event) => {
    const authForm = await superValidate(event.request, zod4(loginSchema));

    if (!authForm.valid) {
      return fail(400, { authForm });
    }

    const username = authForm.data.username;
    const password = authForm.data.password;

    if (!validateUsername(username)) {
      authForm.errors.username = [
        'Only lowercase letters, numbers, underscores and hyphens are allowed in username'
      ];
      return fail(400, { authForm });
    }
    if (!validatePassword(password)) {
      authForm.errors.password = ['Invalid password'];
      return fail(400, { authForm });
    }

    const results = await db.select().from(usersTable).where(eq(usersTable.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { authForm, message: 'Invalid username or password' });
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    if (!validPassword) {
      return fail(400, { authForm, message: 'Invalid username or password' });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/');
  },
  register: async (event) => {
    const authForm = await superValidate(event.request, zod4(loginSchema));

    if (!authForm.valid) {
      return fail(400, { authForm });
    }

    const username = authForm.data.username;
    const password = authForm.data.password;

    if (!validateUsername(username)) {
      authForm.errors.username = [
        'Only lowercase letters, numbers, underscores and hyphens are allowed in username'
      ];
      return fail(400, { authForm });
    }
    if (!validatePassword(password)) {
      authForm.errors.password = ['Invalid password'];
      return fail(400, { authForm });
    }

    const userId = generateUserId();
    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    try {
      await db.insert(usersTable).values({ id: userId, username, passwordHash });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, userId);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch {
      return fail(500, { authForm });
    }
    return redirect(302, '/');
  }
};

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

function validateUsername(username: unknown): username is string {
  return (
    typeof username === 'string' &&
    username.length >= 3 &&
    username.length <= 31 &&
    /^[a-z0-9_-]+$/.test(username)
  );
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
