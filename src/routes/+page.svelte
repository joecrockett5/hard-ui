<script lang="ts">
	import SetComponent from '$lib/hard-components/set.svelte';
</script>

<img src="/hard-logo.png" alt="Hard Logo" class="h-64 w-64 mx-auto rounded-xl mt-16" />

<SetComponent
	set={{
		setType: 'warmup',
		weight: 150,
		weightUnit: 'lbs',
		reps: 5,
		tags: ['Squat', 'Legs'],
		notes:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.',
		comparison:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.'
	}}
/>
