import { fail, redirect } from "@sveltejs/kit";
import * as auth from "$lib/server/auth";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.session) {
 			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		auth.deleteSessionTokenCookie(event as any);

		return redirect(302, '/login');
  }
}
