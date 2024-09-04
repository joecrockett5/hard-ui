<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';

	export let item: string = 'Item';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' }) + ' w-full text-gray-400 mt-1'}>
		<Plus />
		New {item}
	</Dialog.Trigger>
	<Dialog.Content class="w-3/4 max-w-lg">
		<Dialog.Header>
			<Dialog.Title>New {item}</Dialog.Title>
			<Dialog.Description>
				Create a new {item}
			</Dialog.Description>
		</Dialog.Header>

		<slot />
	</Dialog.Content>
</Dialog.Root>
