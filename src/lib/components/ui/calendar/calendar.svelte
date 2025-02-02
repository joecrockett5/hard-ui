<script lang="ts">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import * as Calendar from './index.js';
	import { cn } from '$lib/utils.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import { getLocalTimeZone, today } from '@internationalized/date';

	type $$Props = CalendarPrimitive.Props;

	type $$Events = CalendarPrimitive.Events;

	export let value: $$Props['value'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;
	export let weekdayFormat: $$Props['weekdayFormat'] = 'short';

	let className: $$Props['class'] = undefined;
	export { className as class };

	let japaneseWeekdays = ['日', '月', '火', '水', '木', '金', '土'];
	let japaneseMonths = [
		'1月',
		'2月',
		'3月',
		'4月',
		'5月',
		'6月',
		'7月',
		'8月',
		'9月',
		'10月',
		'11月',
		'12月'
	];
	$: heading =
		value != undefined
			? `${value.toDate(getLocalTimeZone()).getFullYear()}年${japaneseMonths[value.toDate(getLocalTimeZone()).getMonth()]}`
			: '';
</script>

<CalendarPrimitive.Root
	bind:value
	bind:placeholder
	{weekdayFormat}
	class={cn('p-3', className)}
	{...$$restProps}
	on:keydown
	let:months
>
	<Calendar.Header>
		<Calendar.PrevButton on:click={() => (value = value.subtract({ months: 1 }))} />
		{heading}
		<Calendar.NextButton on:click={() => (value = value.add({ months: 1 }))} />
	</Calendar.Header>
	<Calendar.Months>
		{#each months as month}
			<Calendar.Grid>
				<Calendar.GridHead>
					<Calendar.GridRow class="flex justify-center">
						{#each japaneseWeekdays as weekday}
							<Calendar.HeadCell class="mx-1">
								{weekday}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="mt-2 w-full justify-center">
							{#each weekDates as date}
								<Calendar.Cell {date} class="mx-1">
									<Calendar.Day {date} month={month.value} />
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</Calendar.Months>
	<div class="flex flex-row justify-center gap-2">
		<Button
			class="mt-2 flex"
			variant="outline"
			on:click={() => (value = value.subtract({ days: 1 }))}
		>
			&lt;
		</Button>
		<Button
			class="mt-2 flex"
			variant="outline"
			on:click={() => (value = today(getLocalTimeZone()).subtract({ days: 1 }))}
		>
			昨日
		</Button>
		<Button
			class="mt-2 flex"
			variant="outline"
			on:click={() => (value = today(getLocalTimeZone()))}
		>
			今日
		</Button>
		<Button class="mt-2 flex" variant="outline" on:click={() => (value = value.add({ days: 1 }))}>
			&gt;
		</Button>
	</div>
</CalendarPrimitive.Root>
