declare interface IHighlightNode {
    node: {
        __typename: "GraphHighlightReel";
        id: string;
        cover_media: {
            thumbnail_src: string;
        };
        cover_media_cropped_thumbnail: {
            url: string;
        };
        owner: {
            __typename: string;
            id: string;
            profile_pic_url: string;
            username: string;
        };
        title: string;
    };
}
export interface IHighlights {
    has_public_story: boolean;
    edge_highlight_reels: {
        edges: IHighlightNode[];
    };
}
export {};
