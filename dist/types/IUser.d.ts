declare interface IUserBioLink {
    title: string;
    lynx_url: string;
    url: string;
    link_type: string;
}
declare interface IUserTLMediaCaption {
    node: {
        text: string;
    };
}
declare interface IUserTLMediaThumbnailResource {
    src: string;
    config_width: number;
    config_height: number;
}
declare interface IUserTLMediaPinnedForUser {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}
declare interface IUserTLMediaSidecarChild {
    node: {
        __typename: string;
        id: string;
        shortcode: string;
        dimensions: {
            height: number;
            width: number;
        };
        display_url: string;
        edge_media_to_tagged_user: {
            edges: any[];
        };
        fact_check_overall_rating: null;
        fact_check_information: null;
        gating_info: null;
        sharing_friction_info: {
            should_have_sharing_friction: boolean;
            bloks_app_url: null;
        };
        media_overlay_info: null;
        media_preview: string;
        owner: {
            id: string;
            username: string;
        };
        is_video: boolean;
        has_upcoming_event: boolean;
        accessibility_caption: null;
    };
}
declare interface IUserTLMedia {
    node: {
        __typename: string;
        id: string;
        shortcode: string;
        dimensions: {
            height: number;
            width: number;
        };
        display_url: string;
        edge_media_to_tagged_user: {
            edges: any[];
        };
        fact_check_overall_rating: null;
        fact_check_information: null;
        gating_info: null;
        sharing_friction_info: {
            should_have_sharing_friction: boolean;
            bloks_app_url: null;
        };
        media_overlay_info: null;
        media_preview: null;
        owner: {
            id: string;
            username: string;
        };
        is_video: boolean;
        has_upcoming_event: boolean;
        accessibility_caption: null;
        edge_media_to_caption: {
            edges: IUserTLMediaCaption[];
        };
        edge_media_to_comment: {
            count: number;
        };
        comments_disabled: boolean;
        taken_at_timestamp: number;
        edge_liked_by: {
            count: number;
        };
        edge_media_preview_like: {
            count: number;
        };
        location: null;
        nft_asset_info: null;
        thumbnail_src: string;
        thumbnail_resources: IUserTLMediaThumbnailResource[];
        coauthor_producers: any[];
        pinned_for_users: IUserTLMediaPinnedForUser[];
        viewer_can_reshare: boolean;
        edge_sidecar_to_children: {
            edges: IUserTLMediaSidecarChild[];
        };
    };
}
declare interface IUserRelatedProfile {
    node: {
        id: string;
        full_name: string;
        is_private: boolean;
        is_verified: boolean;
        profile_pic_url: string;
        username: string;
    };
}
export interface IUser {
    biography: string;
    bio_links: IUserBioLink[];
    biography_with_entities: {
        raw_text: string;
        entities: any[];
    };
    blocked_by_viewer: boolean;
    restricted_by_viewer: null;
    country_block: boolean;
    external_url: string;
    external_url_linkshimmed: string;
    edge_followed_by: {
        count: number;
    };
    fbid: string;
    followed_by_viewer: boolean;
    edge_follow: {
        count: number;
    };
    follows_viewer: boolean;
    full_name: string;
    group_metadata: null;
    has_ar_effects: boolean;
    has_clips: boolean;
    has_guides: boolean;
    has_channel: boolean;
    has_blocked_viewer: boolean;
    highlight_reel_count: number;
    has_requested_viewer: boolean;
    hide_like_and_view_counts: boolean;
    id: string;
    is_business_account: boolean;
    is_professional_account: boolean;
    is_supervision_enabled: boolean;
    is_guardian_of_viewer: boolean;
    is_supervised_by_viewer: boolean;
    is_supervised_user: boolean;
    is_embeds_disabled: boolean;
    is_joined_recently: boolean;
    guardian_id: null;
    business_address_json: null;
    business_contact_method: string;
    business_email: null;
    business_phone_number: null;
    business_category_name: null;
    overall_category_name: null;
    category_enum: null;
    category_name: string;
    is_private: boolean;
    is_verified: boolean;
    edge_mutual_followed_by: {
        count: number;
        edges: any[];
    };
    profile_pic_url: string;
    profile_pic_url_hd: string;
    requested_by_viewer: boolean;
    should_show_category: boolean;
    should_show_public_contacts: boolean;
    show_account_transparency_details: null;
    transparency_label: null;
    transparency_product: string;
    username: string;
    connected_fb_page: null;
    pronouns: any[];
    edge_felix_video_timeline: {
        count: number;
        page_info: {
            has_next_page: boolean;
            end_cursor: string | null;
        };
        edges: any[];
    };
    edge_owner_to_timeline_media: {
        count: number;
        page_info: {
            has_next_page: boolean;
            end_cursor: string;
        };
        edges: IUserTLMedia[];
    };
    edge_saved_media: {
        count: number;
        page_info: {
            has_next_page: boolean;
            end_cursor: string | null;
        };
        edges: any[];
    };
    edge_media_collections: {
        count: number;
        page_info: {
            has_next_page: boolean;
            end_cursor: string | null;
        };
        edges: any[];
    };
    edge_related_profiles: {
        edges: IUserRelatedProfile[];
    };
}
export {};
