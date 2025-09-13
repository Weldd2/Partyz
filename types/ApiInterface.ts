export interface ApiInterface {
	"@id": string;
	"@type": string;
}

export interface ApiCollectionInterface<T> extends ApiInterface {
	"@context": string;
	totalItems: number;
	member: Array<T>;
}
