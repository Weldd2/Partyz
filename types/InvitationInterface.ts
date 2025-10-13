import { ApiInterface } from "./ApiInterface";
import { UserInterface } from "./UserInterface";

export type InvitationStatus = "pending" | "accepted" | "declined";

export interface InvitationInterface extends ApiInterface {
	"@id": string;
	"@type": string;
	id: string;
	invitedUser: UserInterface;
	status: InvitationStatus;
	invitedAt: string;
	respondedAt?: string;
}
