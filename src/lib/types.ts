export type Tag = {
	name: string;
	color: string;
};

export type Set = {
	setType: string;
	weight: number;
	weightUnit: string;
	reps: number;
	tags?: Tag[];
	notes?: string;
	comparison: string;
};

export type Exercise = {
	name: string;
	description?: string;
	tags?: Tag[];
	sets?: Set[];
};

export type WorkoutInfo = {
	date: string;
	workoutTitle: string;
	tags?: Tag[];
	notes?: string;
};
