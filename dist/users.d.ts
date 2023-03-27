import { IContext } from "./types/IContext";
import { IUser } from "./types/IUser";
export declare function getUserContent(username: string, ctx: IContext): Promise<IUser>;
