declare interface IReelCandidate {
    width: number
    height: number
    url: string
}

declare interface IReelVideoVersion {
    type: number
    width: number
    height: number
    url: string
    id: string
}

export interface IReel {
    media: {
        taken_at: number
        pk: string
        id: string
        device_timestamp: number
        media_type: number
        code: string
        client_cache_key: string
        filter_type: number
        is_unified_video: boolean
        should_request_ads: boolean
        original_media_has_visual_reply_media: boolean
        like_and_view_counts_disabled: boolean
        commerciality_status: string
        is_paid_partnership: boolean
        is_visual_reply_commenter_notice_enabled: boolean
        clips_tab_pinned_user_ids: []
        has_delayed_metadata: boolean
        comment_likes_enabled: boolean
        comment_threading_enabled: boolean
        max_num_visible_preview_comments: number
        has_more_comments: boolean
        preview_comments: []
        comments: []
        comment_count: number
        can_view_more_preview_comments: boolean
        hide_view_all_comment_entrypoint: boolean
        photo_of_you: boolean
        is_organic_product_tagging_eligible: boolean
        can_see_insights_as_brand: boolean
        user: {
            has_anonymous_profile_picture: boolean
            fan_club_info: {
                fan_club_id: string
                fan_club_name: string
                is_fan_club_referral_eligible: boolean
                fan_consideration_page_revamp_eligiblity: {
                    should_show_social_context: boolean
                    should_show_content_preview: boolean
                }
                is_fan_club_gifting_eligible: boolean
            }
            transparency_product_enabled: boolean
            is_unpublished: boolean
            pk: string
            pk_id: string
            strong_id__: string
            username: string
            full_name: string
            is_private: boolean
            is_verified: boolean
            profile_pic_id: string
            profile_pic_url: string
            account_badges: []
        }
        can_viewer_reshare: boolean
        like_count: number
        fb_like_count: number
        has_liked: boolean
        top_likers: []
        facepile_top_likers: []
        is_comments_gif_composer_enabled: boolean
        image_versionsnumber: {
            candidates: IReelCandidate[]
            additional_candidates: {
                igtv_first_frame: {
                    width: number
                    height: number
                    url: string
                }
                first_frame: {
                    width: number
                    height: number
                    url: string
                }
                smart_frame: null
            }
            smart_thumbnail_enabled: boolean
        }
        original_width: number
        original_height: number
        video_subtitles_confidence: number
        caption: {
            pk: string
            user_id: string
            text: string
            type: number
            created_at: number
            created_at_utc: number
            content_type: string
            status: string
            bit_flags: number
            did_report_as_spam: boolean
            share_enabled: boolean
            user: {
                has_anonymous_profile_picture: boolean
                fan_club_info: {
                    fan_club_id: string
                    fan_club_name: string
                    is_fan_club_referral_eligible: boolean
                    fan_consideration_page_revamp_eligiblity: {
                        should_show_social_context: boolean
                        should_show_content_preview: boolean
                    }
                    is_fan_club_gifting_eligible: boolean
                }
                transparency_product_enabled: boolean
                is_unpublished: boolean
                pk: string
                pk_id: string
                strong_id__: string
                username: string
                full_name: string
                is_private: boolean
                is_verified: boolean
                profile_pic_id: string
                profile_pic_url: string
                account_badges: []
            }
            is_covered: boolean
            is_ranked_comment: boolean
            media_id: string
            private_reply_status: number
        }
        caption_is_edited: boolean
        comment_inform_treatment: {
            should_have_inform_treatment: boolean
            text: string
            url: null
            action_type: null
        }
        sharing_friction_info: {
            should_have_sharing_friction: boolean
            bloks_app_url: null
            sharing_friction_payload: null
        }
        video_versions: IReelVideoVersion[]
        has_audio: boolean
        video_duration: number
        can_viewer_save: boolean
        is_in_profile_grid: boolean
        profile_grid_control_enabled: boolean
        play_count: number
        fb_play_count: number
        organic_tracking_token: string
        third_party_downloads_enabled: boolean
        has_shared_to_fb: number
        product_type: string
        show_shop_entrypoint: boolean
        deleted_reason: number
        integrity_review_decision: string
        commerce_integrity_review_decision: null
        music_metadata: null
        is_artist_pick: boolean
        ig_media_sharing_disabled: boolean
        clips_metadata: {
            music_info: null
            original_sound_info: {
                audio_asset_id: string
                music_canonical_id: null
                progressive_download_url: string
                duration_in_ms: number
                dash_manifest: string
                ig_artist: {
                    pk: string
                    pk_id: string
                    username: string
                    full_name: string
                    is_private: boolean
                    is_verified: boolean
                    profile_pic_id: string
                    profile_pic_url: string
                }
                should_mute_audio: boolean
                hide_remixing: boolean
                original_media_id: string
                time_created: number
                original_audio_title: string
                consumption_info: {
                    is_bookmarked: boolean
                    should_mute_audio_reason: string
                    is_trending_in_clips: boolean
                    should_mute_audio_reason_type: null
                    display_media_id: null
                }
                can_remix_be_shared_to_fb: boolean
                formatted_clips_media_count: null
                allow_creator_to_rename: boolean
                audio_parts: []
                is_explicit: boolean
                original_audio_subtype: string
                is_audio_automatically_attributed: boolean
                is_reuse_disabled: boolean
                is_xpost_from_fb: boolean
                xpost_fb_creator_info: null
                nft_info: null
            }
            audio_type: string
            music_canonical_id: string
            featured_label: null
            mashup_info: {
                mashups_allowed: boolean
                can_toggle_mashups_allowed: boolean
                has_been_mashed_up: boolean
                formatted_mashups_count: null
                original_media: null
                privacy_filtered_mashups_media_count: null
                non_privacy_filtered_mashups_media_count: null
                mashup_type: null
                is_creator_requesting_mashup: boolean
                has_nonmimicable_additional_audio: boolean
            }
            reusable_text_info: null
            nux_info: null
            viewer_interaction_settings: null
            branded_content_tag_info: {
                can_add_tag: boolean
            }
            shopping_info: null
            additional_audio_info: {
                additional_audio_username: null
                audio_reattribution_info: {
                    should_allow_restore: boolean
                }
            }
            is_shared_to_fb: boolean
            breaking_content_info: null
            challenge_info: null
            reels_on_the_rise_info: null
            breaking_creator_info: null
            asset_recommendation_info: null
            contextual_highlight_info: null
            clips_creation_entry_point: string
            audio_ranking_info: {
                best_audio_cluster_id: string
            }
            template_info: null
            is_fan_club_promo_video: null
            disable_use_in_clips_client_cache: boolean
            content_appreciation_info: {
                enabled: boolean
                entry_point_container: {
                    pill: {
                        action_type: string
                        priority: number
                    }
                    comment: {
                        action_type: string
                    }
                    overflow: null
                }
            }
            achievements_info: {
                show_achievements: boolean
                num_earned_achievements: null
            }
            show_achievements: boolean
            show_tips: boolean
            merchandising_pill_info: null
            is_public_chat_welcome_video: boolean
            professional_clips_upsell_type: number
        }
        media_cropping_info: {
            square_crop: {
                crop_left: number
                crop_right: number
                crop_top: number
                crop_bottom: number
            }
        }
        logging_info_token: string
        enable_waist: boolean
        view_state_item_type: number
    }
}

export interface IReels {
    items: IReel[]
    paging_info: {
        max_id: string
        more_available: boolean
    }
    status: "ok" | "fail"
}
