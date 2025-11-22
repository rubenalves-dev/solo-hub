<script lang="ts">
  import { FormButton, FormControl } from '$lib/components/ui/form';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import type { Infer } from 'sveltekit-superforms';
  import { loginSchema, type LoginSchema } from '$lib/validation/auth.schema';
  import { zod4Client } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import FormField from '$lib/components/ui/form/form-field.svelte';
  import FormLabel from '$lib/components/ui/form/form-label.svelte';
  import { Input } from '$lib/components/ui/input';
  import FormFieldErrors from '$lib/components/ui/form/form-field-errors.svelte';
  import { Loader } from '@lucide/svelte';

  type Props = {
    data: {
      authForm: SuperValidated<Infer<LoginSchema>>;
    };
  };

  let props: Props = $props();
  let loading = $state(false);

  const authForm = superForm(props.data.authForm, {
    validators: zod4Client(loginSchema),
    onSubmit: () => {
      loading = true;
    },
    onError: ({ result }) => {
      toast.error(result.error.message);
      loading = false;
    },
    onResult: (event) => {
      loading = false;
      switch (event.result.type) {
        case 'success':
          toast.success('Operation successful!');
          break;
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

  const { form: formData, enhance } = authForm;
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
  <FormField class="mb-4" form={authForm} name="username">
    <FormControl>
      {#snippet children({ props })}
        <FormLabel>Username</FormLabel>
        <Input {...props} bind:value={$formData.username} placeholder="Your username" />
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>

  <FormField class="mb-4" form={authForm} name="password">
    <FormControl>
      {#snippet children({ props })}
        <FormLabel>Password</FormLabel>
        <Input
          {...props}
          bind:value={$formData.password}
          type="password"
          placeholder="Your password"
        />
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>

  <FormButton>
    {#if loading}
      <Loader class="animate-spin" />
    {:else}
      Login
    {/if}
  </FormButton>
  <FormButton variant="outline" formaction="?/register">
    {#if loading}
      <Loader class="animate-spin" />
    {:else}
      Register
    {/if}
  </FormButton>
</form>
