type Base = {
	userId?: string;
	timestamp?: string;
	objectId?: string;
	objectType?: string;
};

export type Tag = Base & {
	name: string;
	colorHex: string;
};

export type Set = Base & {
	setType: 'working' | 'warmup';
	weight: number;
	weightUnit: 'kg' | 'lbs';
	reps: number;
	notes: string;
	exerciseJoinId: string;
};

export type Exercise = Base & {
	name: string;
	description: string;
	sets?: Set[];
	joinId?: string;
	workoutId?: string;
};

export type WorkoutInfo = Base & {
	workoutDate: string;
	title: string;
	notes: string;
};

export type Template = Base & {
	name: string;
	description: string;
};
