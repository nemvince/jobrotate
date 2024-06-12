import type { PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
  return {
    user: event.locals.user,
    session: event.locals.session
  };
};
