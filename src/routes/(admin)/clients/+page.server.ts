import { clientService } from '$lib/server/services/client.service';
import { upsertClientSchema } from '$lib/validation/client.schema';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const user = event.locals.user;
  if (!user) return { clients: [] };

  const clients = await clientService.getAll(user.id);
  const clientForm = await superValidate(zod4(upsertClientSchema));
  return { clients, clientForm };
};

export const actions: Actions = {
  upsert: async (event) => {
    const user = event.locals.user;
    if (!user) return;

    const clientForm = await superValidate(event.request, zod4(upsertClientSchema));
    if (!clientForm.valid) {
      return { clientForm };
    }

    const id = clientForm.data.id;
    let client = null;

    if (!id) {
      // Remove any accidental `id` from the payload so it doesn't overwrite the generated id
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      const { id: _maybeId, ...payload } = clientForm.data as any;
      client = await clientService.create(user.id, payload);
    } else {
      client = await clientService.update(id, user.id, clientForm.data);
    }

    return { clientForm, entity: client };
  },
  delete: async (event) => {
    const user = event.locals.user;
    if (!user) return;

    const formData = await event.request.formData();
    const clientId = formData.get('id') as string;

    if (!clientId) {
      return;
    }
    await clientService.delete(clientId, user.id);
  }
};

// FILTERING EXAMPLE WITH SUPERFORMS + ZOD
// export const load: PageServerLoad = async ({ locals, url }) => {
//   const user = locals.user;
//   if (!user) return { clients: [], form: null };

//   // Parse query params with Zod+Superforms
//   const form = await superValidate(url, filterClientsSchema, { in: "query" });

//   let clients = await clientService.getAll(user.userId);

//   // Optional: filter by search phrase
//   if (form.data.search) {
//     const q = form.data.search.toLowerCase();
//     clients = clients.filter((c) =>
//       c.name.toLowerCase().includes(q) ||
//       c.email.toLowerCase().includes(q)
//     );
//   }

//   return {
//     clients,
//     form
//   };
// };
