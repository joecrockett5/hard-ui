<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	type Set = {
		setType: string;
		weight: number;
		weightUnit: string;
		reps: number;
		tags: string[];
		notes: string;
		comparison: string;
	};

	export let set: Set;
</script>

<Accordion.Root class="w-full ">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>{set.weight} {set.weightUnit}: {set.reps} reps</Accordion.Trigger>
		<Accordion.Content>
			<div class="flex flex-col gap-4">
				{#each set.tags as tag}
					<div class="flex gap-2 items-center">
						<div class="w-4 h-4 rounded-full bg-gray-200"></div>
						<span>{tag}</span>
					</div>
				{/each}
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
