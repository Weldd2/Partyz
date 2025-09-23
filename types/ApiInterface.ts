export interface ApiInterface {
	'@type': string;
	'@id': string;	
};

export interface ApiCollectionInterface<T> extends ApiInterface {
	'@context': string;
	totalItems: number;
	member: Array<T>;
}
