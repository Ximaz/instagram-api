import { IContext } from "./types/IContext";
import { IHighlights } from "./types/IHighlights";
import { IPosts, IPost } from "./types/IPosts";
import { IUser } from "./types/IUser";
export declare function getUser(username: string, ctx: IContext): Promise<IUser>;
export declare function getUserPosts(user: IUser, ctx: IContext, { first, after }: {
    first: number;
    after: string | null;
}): Promise<IPosts>;
export declare function getAllUserPosts(user: IUser, ctx: IContext, { first, after }: {
    first: number;
    after: string | null;
}): Promise<IPost[]>;
export declare function getUserHighlights(user: IUser, ctx: IContext): Promise<IHighlights>;
