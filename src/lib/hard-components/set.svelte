<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Set } from '$lib/types';

	export let set: Set;
</script>

<Accordion.Root class="w-full ">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>{set.weight} {set.weightUnit}: {set.reps} reps</Accordion.Trigger>
		<Accordion.Content>
			<div>
				<Button class="float-right top-4 right-4" variant="ghost">Edit</Button>
				<!-- TODO: Add Edit button -->
				<div class="flex flex-col gap-4">
					{#if set.tags}
						{#each set.tags as tag}
							<div class="flex gap-2 items-center">
								<div class="w-4 h-4 rounded-full bg-gray-200"></div>
								<span>{tag.name}</span>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<br />
			<br />

			<h1 class="text-xl font-bold">Notes</h1>
			<p>{set.notes}</p>

			<br />
			<br />

			<h1 class="text-xl font-bold">Comparison</h1>
			<p>{set.comparison}</p>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
