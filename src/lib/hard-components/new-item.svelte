<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';

	export let item: string = 'Item';
	export let description: string = '';
	export let className: string = '';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' }) + ' w-full text-gray-400 mt-1'}>
		<Plus />
		新しい {item}
	</Dialog.Trigger>
	<Dialog.Content class={className + ' w-3/4 max-w-lg'}>
		<Dialog.Header>
			<Dialog.Title>新しい {item}</Dialog.Title>
			<Dialog.Description>
				{description}
			</Dialog.Description>
		</Dialog.Header>
		<div class="mt-4" />

		<slot />
	</Dialog.Content>
</Dialog.Root>
