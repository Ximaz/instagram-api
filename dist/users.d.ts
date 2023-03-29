import { IContext } from "./types/IContext";
import { IHighlights } from "./types/IHighlights";
import { IPosts, IPost } from "./types/IPosts";
import { IReel, IReels } from "./types/IReels";
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
export declare function getUserReels(user: IUser, ctx: IContext, { page_size, max_id }: {
    page_size: number;
    max_id: string | null;
}): Promise<IReels>;
export declare function getAllUserReels(user: IUser, ctx: IContext, { page_size, max_id }: {
    page_size: number;
    max_id: string | null;
}): Promise<IReel[]>;
export declare function getUserHighlights(user: IUser, ctx: IContext): Promise<IHighlights>;
