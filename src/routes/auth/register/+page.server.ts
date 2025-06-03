import { createUser } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            return fail(400, { error: 'Invalid form data' });
        }

        try {
            const user = await createUser(email, password);
            cookies.set('session', user.id, { path: '/', httpOnly: true });
            throw redirect(303, '/');
        } catch (e: any) {
            return fail(400, { error: e.message });
        }
    }
} satisfies Actions; 