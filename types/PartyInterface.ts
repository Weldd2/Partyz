import { ApiInterface } from "./ApiInterface";
import { UserInterface } from "./UserInterface";

export interface PartyInterface extends ApiInterface {
	"@id": string;
	"@type": string;
	id: string;
	title: string;
	address: string;
	date: string;
	members: Array<UserInterface>;
	shoppingList: Array<
		{
			"@id": string;
			"@type": string;
			id: number;
			name: string;
			quantity: number;
			broughtQuantity: number;
		}
	>;
	owner: UserInterface;
}
