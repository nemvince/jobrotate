import { prisma } from '$lib/server/prisma';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { passwordStrength } from 'check-password-strength';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }
};

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData();
    const { email, password, username } = Object.fromEntries(data) as Record<string, string>;
    const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(password);

    if (!username) {
      return fail(400, { message: 'Username is required' });
    }
    if (!email) {
      return fail(400, { message: 'Email is required' });
    }
    if (await prisma.user.findUnique({ where: { username } })) {
      return fail(400, { message: 'Username already taken' });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return fail(400, { message: 'Email already registered' });
    }
    if (passwordStrength(password).id < 3) {
      return fail(400, { message: 'Password is too weak' });
    }

    const user = await prisma.user.create({
      data: {
        id: userId,
        username: username,
        email: email,
        password: hashedPassword
      }
    });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
    return redirect(302, '/');
  },

  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const { username, password } = Object.fromEntries(data) as Record<string, string>;

    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });
    if (!user) {
      return fail(400, { message: 'User not found' });
    }
    const valid = await new Argon2id().verify(user.password, password);
    if (!valid) {
      return fail(400, { message: 'Invalid password' });
    }
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
    redirect(302, '/');
  },

  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401, { message: 'Not authenticated' });
    }

    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
    redirect(302, '/auth');
  }
};
