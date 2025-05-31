import { json } from '@sveltejs/kit';
import { getUptimeHistory } from '$lib/server/health';

export async function GET() {
    const history = await getUptimeHistory('server');
    return json(history);
} 