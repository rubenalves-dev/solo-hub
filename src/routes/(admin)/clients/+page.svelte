<script lang="ts">
  import { applyAction, enhance as svelteEnhance } from '$app/forms';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import * as Drawer from '$lib/components/ui/drawer';
  import * as Empty from '$lib/components/ui/empty';
  import * as Table from '$lib/components/ui/table';
  import type { ClientsTable } from '$lib/server/db/schemas';
  import type { ServiceList } from '$lib/types/services';
  import { Pencil, Plus, SquareUser, Trash } from '@lucide/svelte';
  import { getTitle } from '../../context';
  import * as Form from '$lib/components/ui/form';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { upsertClientSchema, type UpsertClientSchema } from '$lib/validation/client.schema';
  import { zod4Client } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { Input } from '$lib/components/ui/input';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import FormButton from '$lib/components/ui/form/form-button.svelte';
  import Spinner from '$lib/components/ui/spinner/spinner.svelte';
  import { invalidateAll } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/state';

  type Props = {
    data: {
      clients: ServiceList<ClientsTable>;
      clientForm: SuperValidated<Infer<UpsertClientSchema>>;
    };
  };

  let props: Props = $props();
  let loading = $state(false);
  let isDrawerOpen = $state(false);
  let entity = $state<ClientsTable | null>(null);

  const clientForm = superForm(props.data.clientForm, {
    validators: zod4Client(upsertClientSchema),
    resetForm: false,
    onSubmit: () => {
      loading = true;
    },
    onError: ({ result }) => {
      toast.error(result.error.message);
      loading = false;
    },
    onResult: async (event) => {
      loading = false;
      switch (event.result.type) {
        case 'success': {
          toast.success('Operation successful!');
          const entityData = event.result.data?.entity;
          if (entityData) {
            formData.update(() => ({ ...entityData }));
            entity = entityData;
          }
          break;
        }
        case 'error':
          toast.error('Operation failed.');
          break;
        default: {
          if (event.result.status == 429) {
            toast.error('Too many requests. Please try again later.');
          } else {
            if (event.result.type === 'failure') {
              const message = event.result.data?.message;
              if (message) {
                toast.error(message);
              }
            }
          }
          break;
        }
      }
    }
  });

  const { form: formData, enhance } = clientForm;

  async function openDrawer(id?: string | null) {
    if (!id) {
      clientForm.reset();
      entity = null;
      isDrawerOpen = true;
      return;
    }

    try {
      if (entity) {
        if (entity.id === id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const entityData = entity as any;
          formData.update((current) => ({ ...current, ...entityData }));
          isDrawerOpen = true;
          return;
        }
        entity = null;
      }
      const res = await fetch(`${page.url.pathname}/${encodeURIComponent(id)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body?.message ?? 'Failed to load client');
      }
      const client = await res.json();
      formData.update((current) => ({ ...current, ...client }));
      entity = client;
      isDrawerOpen = true;
    } catch (err) {
      console.log(err);
      entity = null;
      toast.error('Failed to load client');
    }
  }

  async function closeDrawer() {
    clientForm.reset();
    isDrawerOpen = false;
  }
</script>

<svelte:head>
  <title>{getTitle('Clients')}</title>
</svelte:head>

<h1 class="mb-4 text-2xl font-bold">Clients</h1>

<div class="flex flex-wrap items-center justify-between">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Clients</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <Button onclick={() => openDrawer()}><Plus />Add Client</Button>
</div>

{#if props.data.clients.total === 0}
  <Empty.Root>
    <Empty.Header>
      <Empty.Media variant="icon">
        <SquareUser />
      </Empty.Media>
      <Empty.Title>No clients yet</Empty.Title>
      <Empty.Description>
        You haven't added any clients yet. Start by clicking the "Add" button below to create your
        first client.
      </Empty.Description>
    </Empty.Header>
    <Empty.Content>
      <Button onclick={() => openDrawer()}><Plus />Add Client</Button>
    </Empty.Content>
  </Empty.Root>
{:else}
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Name</Table.Head>
        <Table.Head>Email</Table.Head>
        <Table.Head>Phone</Table.Head>
        <Table.Head>Projects</Table.Head>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#each props.data.clients.items as client (client.id)}
        <Table.Row>
          <Table.Cell>{client.name}</Table.Cell>
          <Table.Cell>{client.email}</Table.Cell>
          <Table.Cell>{client.phone}</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>
            <form
              class="flex gap-1"
              method="post"
              action="?/delete"
              use:svelteEnhance={() => {
                return async ({ result }) => {
                  if (result.type === 'success') {
                    toast.success('Client deleted successfully!');
                    await invalidateAll();
                  } else if (result.type === 'error') {
                    toast.error('Failed to delete client.');
                  }
                  applyAction(result);
                };
              }}
            >
              <input type="hidden" value={client.id} name="id" />

              <Button onclick={() => openDrawer(client.id)} variant="outline" size="icon-sm"
                ><Pencil /></Button
              >
              <Button variant="destructive" formaction="?/delete" size="icon-sm" type="submit"
                ><Trash /></Button
              >
            </form>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>

    <Table.Footer>
      <Table.Row>
        <Table.Cell>Total: {props.data.clients.total ?? 0}</Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table.Root>
{/if}

<Drawer.Root direction="right" bind:open={isDrawerOpen} onClose={() => closeDrawer()}>
  <Drawer.Content>
    <form class="flex h-full flex-col" action="?/upsert" method="post" use:enhance>
      <Drawer.Header>
        <Drawer.Title>{entity ? entity.name : 'New client'}</Drawer.Title>
        <Drawer.Description
          >Fill the form to {entity ? 'edit' : 'create'} a new client</Drawer.Description
        >
      </Drawer.Header>

      <div class="p-4">
        <Form.Field class="mb-4" form={clientForm} name="id">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Client ID</Form.Label>
              <Input {...props} type="hidden" bind:value={$formData.id} readonly />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field class="mb-4" form={clientForm} name="name">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Name</Form.Label>
              <Input {...props} bind:value={$formData.name} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field class="mb-4" form={clientForm} name="email">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>E-mail</Form.Label>
              <Input {...props} bind:value={$formData.email} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field class="mb-4" form={clientForm} name="phone">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Phone</Form.Label>
              <Input {...props} bind:value={$formData.phone} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field class="mb-4" form={clientForm} name="address">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Address</Form.Label>
              <Input {...props} bind:value={$formData.address} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field class="mb-4" form={clientForm} name="notes">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Notes</Form.Label>
              <Textarea {...props} bind:value={$formData.notes} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>

      <Drawer.Footer class="justify-self-end">
        <div class="flex gap-2">
          <Button variant="outline" onclick={() => closeDrawer()}>Cancel</Button>
          <FormButton disabled={loading}>
            {#if loading}
              <Spinner />
            {/if}
            Submit
          </FormButton>
        </div>
      </Drawer.Footer>
    </form>
  </Drawer.Content>
</Drawer.Root>
