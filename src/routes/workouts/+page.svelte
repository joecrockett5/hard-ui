<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import type { WorkoutInfo } from '$lib/types';
	import WorkoutInfoComponent from '$lib/hard-components/workout-info.svelte';

	let selectedDate = today(getLocalTimeZone());

	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const nthNumber = (number: number) => {
		if (number > 3 && number < 21) return 'th';
		switch (number % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	};

	$: asDate = selectedDate.toDate(getLocalTimeZone());
	$: shortDate = `${asDate.getDate()}/${asDate.getMonth() + 1}/${asDate.getFullYear()}`;
	$: longDate = `${weekdays[asDate.getDay()]}, ${asDate.getDate()}${nthNumber(asDate.getDate())} ${months[asDate.getMonth()]} ${asDate.getFullYear()}`;

	let workouts: WorkoutInfo[] = [
		{
			date: '2023-01-01',
			workoutTitle: 'Test Workout',
			tags: [
				{
					name: 'Squat',
					color: 'blue'
				},
				{
					name: 'Bench Press',
					color: 'red'
				}
			],
			notes: 'This is a note'
		},
		{
			date: '2023-01-02',
			workoutTitle: 'Test Workout',
			tags: [
				{
					name: 'Squat',
					color: 'blue'
				},
				{
					name: 'Bench Press',
					color: 'red'
				}
			],
			notes: 'This is a note'
		}
	];
</script>

<Calendar bind:value={selectedDate} class="rounded-md border" />

<Card.Root class="mt-4">
	<Card.Header>
		<Card.Title>{longDate}</Card.Title>
		<Card.Description>All workouts recorded for {shortDate}</Card.Description>
	</Card.Header>
</Card.Root>

{#if workouts.length > 0}
	{#each workouts as workout}
		<WorkoutInfoComponent {workout} />
	{/each}
{/if}
