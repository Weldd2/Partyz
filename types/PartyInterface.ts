import { ApiInterface } from "./ApiInterface";
import { ShoppingListInterface } from "./ShoppingListItem";
import { UserInterface } from "./UserInterface";

export interface PartyInterface extends ApiInterface {
	"@id": string;
	"@type": string;
	id: string;
	title: string;
	address: string;
	date: string;
	members: Array<UserInterface>;
	shoppingList: Array<ShoppingListInterface>;
	owner: UserInterface;
}
