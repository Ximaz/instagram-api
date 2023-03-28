declare interface IPostResource {
    src: string;
    config_width: number;
    config_height: number;
}
declare interface IPostNodeCaption {
    node: {
        text: string;
    };
}
declare interface IPostSidecarChild {
    node: {
        __typename: "GraphSidecar" | "GraphImage" | "GraphVideo";
        id: string;
        gating_info: null;
        fact_check_overall_rating: null;
        fact_check_information: null;
        media_overlay_info: null;
        sensitivity_friction_info: null;
        sharing_friction_info: {
            should_have_sharing_friction: boolean;
            bloks_app_url: null;
        };
        dimensions: {
            height: number;
            width: number;
        };
        display_url: string;
        display_resources: IPostResource[];
        is_video: boolean;
        media_preview: string;
        tracking_token: string;
        has_upcoming_event: boolean;
        edge_media_to_tagged_user: {
            edges: IPostNodeCaption[];
        };
        accessibility_caption: null;
    };
}
export interface IPost {
    __typename: string;
    id: string;
    gating_info: null;
    fact_check_overall_rating: null;
    fact_check_information: null;
    media_overlay_info: null;
    sensitivity_friction_info: null;
    sharing_friction_info: {
        should_have_sharing_friction: boolean;
        bloks_app_url: null;
    };
    dimensions: {
        height: number;
        width: number;
    };
    display_url: string;
    display_resources: IPostResource[];
    is_video: boolean;
    media_preview: null;
    tracking_token: string;
    has_upcoming_event: boolean;
    edge_media_to_tagged_user: {
        edges: IPostNodeCaption[];
    };
    accessibility_caption: null;
    edge_media_to_caption: {
        edges: IPostNodeCaption[];
    };
    shortcode: string;
    edge_media_to_comment: {
        count: number;
        page_info: {
            has_next_page: boolean;
            end_cursor: string;
        };
    };
    edge_media_to_sponsor_user: {
        edges: IPostNodeCaption[];
    };
    is_affiliate: boolean;
    is_paid_partnership: boolean;
    comments_disabled: boolean;
    taken_at_timestamp: number;
    edge_media_preview_like: {
        count: number;
        edges: any[];
    };
    owner: {
        id: string;
        username: string;
    };
    location: null;
    nft_asset_info: null;
    viewer_has_liked: boolean;
    viewer_has_saved: boolean;
    viewer_has_saved_to_collection: boolean;
    viewer_in_photo_of_you: boolean;
    viewer_can_reshare: boolean;
    thumbnail_src: string;
    thumbnail_resources: IPostResource[];
    coauthor_producers: any[];
    pinned_for_users: any[];
    edge_sidecar_to_children: {
        edges: IPostSidecarChild[];
    };
}
export interface IPosts {
    edge_owner_to_timeline_media: {
        count: number;
        page_info: {
            has_next_page: boolean;
            end_cursor: string;
        };
        edges: IPost[];
    };
}
export {};
