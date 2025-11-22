<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import FormButton from '$lib/components/ui/form/form-button.svelte';

  import {
    CirclePlus,
    Calendar,
    FileText,
    ChartGantt,
    Kanban,
    SquareCheck,
    FolderClosed,
    SquareUser,
    CircleDollarSign
  } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<div id="root" class="flex min-h-screen">
  <header></header>

  <!-- <aside></aside> -->

  <nav class="flex flex-col justify-between">
    <ul>
      <li><Button><CirclePlus />Add Task</Button></li>
      <li><Button variant="ghost"><Calendar />My Time</Button></li>
      <li><Button variant="ghost"><FileText />Reports</Button></li>

      <li class="title">Plan</li>
      <!-- <li><Button variant="ghost">My Time</Button></li> -->
      <li><Button variant="ghost"><ChartGantt />Timeline</Button></li>
      <li><Button variant="ghost"><Kanban />Board</Button></li>

      <li class="title">Manage</li>
      <li><Button variant="ghost"><SquareCheck />Tasks</Button></li>
      <li><Button variant="ghost"><FolderClosed />Projects</Button></li>
      <li><Button variant="ghost" href="/clients"><SquareUser />Clients</Button></li>
      <li><Button variant="ghost"><CircleDollarSign />Invoices</Button></li>
    </ul>

    <div>
      <!-- <h1>Hi, {data.user?.username}!</h1> -->
      <form method="post" action="/logout" use:enhance>
        <FormButton variant="outline" type="submit">Sign out</FormButton>
      </form>
    </div>
  </nav>

  <main>
    {@render children()}
  </main>

  <!-- <footer></footer> -->
</div>

<style>
  #root {
    display: grid;
    grid-template-columns: 3rem 12.5rem 1fr;
    grid-template-rows: 4rem 1fr;
  }

  header {
    grid-column: 3 / -1;
    grid-row: 1 / 2;
    border-bottom: 1px solid var(--color-border);
  }

  aside {
    grid-column: 1/2;
    grid-row: 1 / -1;
    background-color: var(--color-muted);
  }

  nav {
    grid-column: 1 / 3;
    grid-row: 1 / -1;
    border-right: 1px solid var(--color-border);
  }

  main {
    grid-column: 3 / -1;
    grid-row: 2 / -1;
    overflow: auto;
  }

  header,
  aside,
  nav,
  main {
    padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
  }
</style>
