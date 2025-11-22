import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({locals}) => {
	const user = requireLogin(locals);
	return { user };
};

function requireLogin(locals: App.Locals) {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	return locals.user;
}
