import { ApiInterface } from "./ApiInterface";
import { InvitationInterface } from "./InvitationInterface";
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
	invitations: Array<InvitationInterface>;
	shoppingList: Array<ShoppingListInterface>;
	owner: UserInterface;
}
