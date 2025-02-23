<script lang="ts">
	import { page } from '$app/stores';
	import { swipe } from 'svelte-gestures';
	import { getLocalTimeZone, today, parseDate } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { writable } from 'svelte/store';
	import type { WorkoutInfo } from '$lib/types';
	import WorkoutInfoComponent from '$lib/hard-components/workout-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import { fetchAuthSession } from 'aws-amplify/auth';

	// let customDate = $page.url.searchParams.get('date');

	let workouts: WorkoutInfo[] = [];
	let selectedDate = writable(today(getLocalTimeZone()));

	// if (customDate) {
	// 	selectedDate.set(parseDate(customDate));
	// }

	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const japaneseWeekdays = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];
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

	$: asDate = $selectedDate.toDate(getLocalTimeZone());
	$: shortDate = `${asDate.getFullYear()}年${asDate.getMonth() + 1}月${asDate.getDate()}日`;
	$: longDate = `${asDate.getFullYear()}年の${asDate.getMonth() + 1}月${asDate.getDate()}日、${japaneseWeekdays[asDate.getDay()]}`;

	async function loadDate(date) {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/workouts?token=${session.tokens?.idToken?.toString()}&date=${date.toString().split('T')[0]}`
		);
		const workoutsForDate = await response.json();
		return workoutsForDate;
	}

	selectedDate.subscribe(async (date) => {
		workouts = await loadDate(date);
		workouts = workouts;
	});

	let newWorkoutTitle = '';
	let newWorkoutNotes = '';

	async function addWorkout() {
		const session = await fetchAuthSession();
		const response = await fetch(`/api/workouts?token=${session.tokens?.idToken?.toString()}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: newWorkoutTitle,
				notes: newWorkoutNotes,
				workoutDate: $selectedDate.toString().split('T')[0]
			})
		});
		if (response.ok) {
			newWorkoutTitle = '';
			newWorkoutNotes = '';

			const json = await response.json();
			const createdWorkout: WorkoutInfo = {
				userId: json.user_id,
				timestamp: json.timestamp,
				objectType: json.object_type,
				objectId: json.object_id,
				title: json.title,
				notes: json.notes,
				workoutDate: json.workout_date,
				tags: []
			};
			workouts.push(createdWorkout);
			workouts = workouts;
		}
	}

	let direction;

	function handleSwipe(e) {
		direction = e.detail.direction;
		switch (direction) {
			case 'left':
				$selectedDate = $selectedDate.add({ days: 1 });
				break;
			case 'right':
				$selectedDate = $selectedDate.subtract({ days: 1 });
				break;
		}
	}
</script>

<svelte:head>
	<title>Hard: Workouts</title>
</svelte:head>

<Calendar bind:value={$selectedDate} class="rounded-md border" />

<Card.Root class="mt-4">
	<Card.Header>
		<Card.Title>{longDate}</Card.Title>
		<Card.Description>{shortDate}のトレーニング全部</Card.Description>
	</Card.Header>
</Card.Root>

<NewItem item="トレーニング">
	<label for="date">日付：</label>
	<Input value={shortDate} disabled />
	<label for="title">タイトル：</label>
	<Input placeholder="タイトル" bind:value={newWorkoutTitle} />
	<label for="Notes">メモ：</label>
	<Input placeholder="メモ" bind:value={newWorkoutNotes} />
	<br />
	<Dialog.Footer>
		<Dialog.Close class={buttonVariants({ variant: 'default' })} on:click={addWorkout}
			>追加</Dialog.Close
		>
	</Dialog.Footer>
</NewItem>

<div
	use:swipe={{ timeframe: 300, minSwipeDistance: 10, touchAction: 'pan-y' }}
	on:swipe={handleSwipe}
	class="h-screen"
>
	{#if workouts.length > 0}
		{#each workouts as workout}
			<a href="/workouts/{workout.objectId}">
				<WorkoutInfoComponent {workout} brief />
			</a>
		{/each}
	{/if}
</div>
