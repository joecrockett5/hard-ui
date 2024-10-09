type Base = {
	userId: string;
	timestamp: string;
	objectId: string;
	objectType: string;
};

export type Tag = Base & {
	name: string;
	color: string;
};

export type Set = Base & {
	setType: 'working' | 'warmup';
	weight: number;
	weightUnit: 'kg' | 'lbs';
	reps: number;
	tags?: Tag[];
	notes?: string;
	exerciseJoinId: string;
};

export type Exercise = Base & {
	name: string;
	description?: string;
	tags?: Tag[];
	sets?: Set[];
};

export type WorkoutInfo = Base & {
	date: string;
	workoutTitle: string;
	tags?: Tag[];
	notes?: string;
};
