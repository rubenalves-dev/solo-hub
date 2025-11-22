import { clientService } from '$lib/server/services/client.service';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const id = event.params.id;
  const user = event.locals.user;

  if (!user || !id) {
    return new Response(JSON.stringify({ message: 'Missing id or unauthenticaded' }), {
      status: 400
    });
  }

  const client = await clientService.get(id, user.id);
  if (!client) {
    return new Response(JSON.stringify({ message: 'Client not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(client), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
