import { loadTheme } from '$lib/stores/theme';
import type { PageLoad } from './$types';

interface PageData {
    user?: { id: string } | null;
}

export const load: PageLoad = async ({ data = null as PageData | null }) => {
    // Only attempt to load theme if we have both data and a user ID
    if (data && data.user?.id) {
        await loadTheme(data.user.id);
    }
    return data || {};
}; 