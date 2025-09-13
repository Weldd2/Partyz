import { ApiInterface } from "./ApiInterface";

export interface UserInterface extends ApiInterface {
	id: number;
	phoneNumber: string;
	firstname: string;
	lastname: string;
}
