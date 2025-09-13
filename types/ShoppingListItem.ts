import { ApiInterface } from "./ApiInterface";

export interface ShoppingListInterface extends ApiInterface {
	id: number;
	name: string;
	quantity: number;
	broughtQuantity: number;
}
