import { getUserTheme, updateUserTheme } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const theme = await getUserTheme(params.userId);
        if (!theme) {
            throw error(404, 'Theme not found');
        }
        return json(theme);
    } catch (e) {
        throw error(500, 'Failed to load theme');
    }
};

export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const theme = await request.json();
        const updatedTheme = await updateUserTheme(params.userId, theme);
        return json(updatedTheme);
    } catch (e) {
        throw error(500, 'Failed to update theme');
    }
}; 