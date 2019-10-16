const pubsub = {
    // background to contentscript

    // contentscript.jsのextract.jsで取得したコンテンツをbackground.jsからリクエストする
    bg_to_extract_to_bg: 'bg_to_extract_to_bg',
    // background.jsからcontentscript.jsのiframe表示非表示の関数を呼ぶ
    bg_to_show: 'bg_to_show',
    // background.jsからpopupへMLServerの結果を送信する。
    bg_to_popup_mlresponce: 'bg_to_popup_mlresponce',
    // background.jsからpopupへitemを保存していたら保存済みのitemを送信する
    bg_to_popup_saved_item: 'bg_to_popup_saved_item',
    // background.jsからpopupへ更新したtagsを送信する
    bg_to_popup_updated_tags: 'bg_to_popup_updated_tags',

    // popup to background

    // popupからbackgroundへtabIdをリクエストする
    popup_to_bg_get_tabid: 'popup_to_bg_get_tabid',
    // popupからbackgroundへ保存されたコンテンツを更新する
    popup_to_bg_update_tab: 'popup_to_bg_update_tab',
        // recommend_tag, user input, user_tag
        add_tag: 'add_tag',
        remove_tag: 'remove_tag',
        update_tab_type: 'update_tab_type',
}

export default pubsub
