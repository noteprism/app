import { json } from '@sveltejs/kit';
import { getHealthHistory } from '$lib/server/health';

export async function GET() {
    const history = await getHealthHistory();
    return json(history);
} 