<script lang="ts">
	import type { WorkoutInfo } from '$lib/types';
	import * as Card from '$lib/components/ui/card';

	export let workout: WorkoutInfo;
</script>

<Card.Root class="mt-4">
	<Card.Header>
		<Card.Title>{workout.workoutTitle}</Card.Title>
		<Card.Description>Workout on {workout.date}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-2">
				<div class="flex gap-2">
					<div class="flex-1">
						<span class="text-sm font-semibold">Tags</span>
						<div class="flex flex-wrap gap-2">
							{#if workout.tags}
								{#each workout.tags as tag}
									<div class="flex items-center gap-2">
										<span
											class="rounded-full w-4 h-4 bg-gray-200"
											style="background-color: {tag.color}"
										/>
										<span>{tag.name}</span>
									</div>
								{/each}
							{/if}
						</div>
					</div>

					{#if workout.notes}
						<div class="flex-1">
							<span class="text-sm font-semibold">Notes</span>
							<p>{workout.notes}</p>
						</div>
					{/if}
				</div>
			</div>
		</div></Card.Content
	>
</Card.Root>
