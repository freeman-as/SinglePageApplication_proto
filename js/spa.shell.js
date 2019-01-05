/*
 * spa.shell.js
 * SPAのシェルモジュール
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 4,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

spa.shell = (function () {
    // ---------- モジュールスコープ変数開始 ----------
    var configMap = {
            anchor_shema_map: {
                chat: {
                    open: true,
                    closed: true,
                },
            },
            main_html: String()
                + '<div class="spa-shell-head">'
                    + '<div class="spa-shell-head-logo"></div>'
                    + '<div class="spa-shell-head-acct"></div>'
                    + '<div class="spa-shell-head-search"></div>'
                + '</div>'
                + '<div class="spa-shell-main">'
                    + '<div class="spa-shell-main-nav"></div>'
                    + '<div class="spa-shell-main-content"></div>'
                + '</div>'
                + '<div class="spa-shell-foot"></div>'
                + '<div class="spa-shell-chat"></div>'
                + '<div class="spa-shell-modal"></div>',
            chat_extende_time: 250,
            chat_retract_time: 300,
            chat_extend_height: 450,
            chat_retract_height: 15,
            chat_extend_title: 'Click to retract',
            chat_retract_title: 'Click to extend',
        },
        stateMap = {
            $container: null,
            anchor_map: {},
            is_chat_retracted: true,
        },
        jqueryMap = {},

        copyAchorMap, setJqueryMap, toggleChat, changeAnchorPart, onHashChange, onClickChat, initModule;

    // ---------- モジュールスコープ変数終了 ----------

    // ---------- ユーティリティメソッド開始 ----------
    // 格納したアンカーマップのコピーを返す。オーバーヘッドを最小限にする。
    copyAchorMap = function () {
        return $.extend(true, {}, stateMap.anchor_map);
    };
    // ---------- ユーティリティメソッド終了 ----------

    // ---------- DOMメソッド開始 ----------
    // DOMメソッド/setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $chat: $container.find('.spa-shell-chat'),
        };
    };

    // DOMメソッド/toggleChat/
    // 目的：チャットスライダーの拡大や格納
    // 引数：
    //    * do_extend - trueの場合、スライダーを拡大。falseの場合は格納。
    //    * callback - アニメーションの最後に実行するオプション関数
    // 設定：
    //    * chat_extend_time, chat_retract_time
    //    * chat_extend_height, chat_retract_height
    // 戻り値：boolean
    //    * true - スライダーアニメーション開始
    //    * false - アニメーションされない
    // 状態：stateMap.is_chat_retractedを設定
    //    * true - スライダー格納時
    //    * false - スライダー拡大時
    // 
    toggleChat = function(do_extend, callback) {
        var px_chat_ht = jqueryMap.$chat.height(),
            is_open = px_chat_ht === configMap.chat_extend_height,
            is_closed = px_chat_ht === configMap.chat_retract_height,
            is_sliding = ! is_open && ! is_closed;

        // 競合状態を避ける
        if (is_sliding) { return false; }
            

        // チャットスライダー拡大
        if (do_extend) {
            jqueryMap.$chat.animate(
                { height: configMap.chat_extend_height },
                configMap.chat_extende_time,
                function () {
                    jqueryMap.$chat.attr(
                        'title', configMap.chat_extend_title
                    );
                    stateMap.is_chat_retracted = false;
                    if (callback) {
                        callback(jqueryMap.$chat);
                    }
                }
            );
            return true;
        }

        // チャットスライダー格納
        jqueryMap.$chat.animate(
            { height: configMap.chat_retract_height },
            configMap.chat_retract_time,
            function () {
                jqueryMap.$chat.attr(
                    'title', configMap.chat_retract_title
                );
                stateMap.is_chat_retracted = true;
                if (callback) {
                    callback(jqueryMap.$chat);
                }
            }
        );
        return true;
    };

    // DOMメソッド/changeAnchorPart/
    // 目的：URIアンカー要素部分を変更
    // 引数：
    //    * arg_map - 変更したいURIアンカー部分を表すマップ
    // 戻り値：boolean
    //    * true - URIのアンカー部分更新
    //    * false - URIのアンカー部分更新失敗
    // 動作：
    // 現在のアンカーをstateMap.anchor_mapに格納
    // エンコーディングの説明はuriAnchorを参照
    // このメソッドは
    //    * copyAnchorMap()を使って子のマップのコピーを作成
    //    * arg_mapを使ってキーバリューを修正
    //    * uriAnchorを使ってURIの変更を試みる
    //    * 成功時にはtrue、失敗時にはfalse
    // 
    changeAnchorPart = function(arg_map) {
        var anchor_map_revise = copyAchorMap(),
            bool_return = true,
            key_name, key_name_dep;

        // アンカーマップへ変更を統合開始
        KEYVAL:
        for (key_name in arg_map) {
            if (arg_map.hasOwnProperty(key_name)) {
                // 反復中に従属キーを飛ばす
                if (key_name.indexOf('_') === 0) {
                    continue KEYVAL;
                }

                // 独立キーを更新
                anchor_map_revise[key_name] = arg_map[key_name];

                // 合致する独立キーを更新
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                } else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }

        // URIの更新開始。成功しなければ元に戻す
        try {
            $.uriAnchor.setAnchor(anchor_map_revise);
        } catch(error) {
            // URIを既存の状態に置き換える
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            bool_return = false;
        }

        return bool_return;
    };

    // ---------- DOMメソッド終了 ----------
    
    // ---------- イベントハンドラ開始 ----------
    // イベントハンドラ/onHashChange/
    // 目的：hashchangeイベントを処理
    // 引数：
    //    * event - jQueryイベントオブジェクト
    // 設定：なし
    // 戻り値：false
    // 動作：
    //    * URIアンカー要素を解析
    //    * 提示されたアプリケーション状態と現在の状態を比較
    //    * 提示された状態が既存の状態と異なる場合のみ、アプリケーションを調整
    // 
    onHashChange = function(event) {
        var anchor_map_previous = copyAchorMap(),
            anchor_map_proposed,
            _s_chat_previous, _s_chat_proposed, s_chat_proposed;

        // アンカーの解析を試みる
        console.log('am_previous:' + JSON.stringify(anchor_map_previous));
        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
            console.log('am_proposed:' + JSON.stringify(anchor_map_proposed));
        } catch(error) {
            $.uriAnchor.setAnchor(anchor_map_previous, null, false);
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;

        // 便利な変数
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;

        // 変更されている場合のチャットコンポーネントの調整
        if (! anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
            s_chat_proposed = anchor_map_proposed.chat;
            switch (s_chat_proposed) {
                case 'open':
                    toggleChat(true);
                break;
                case 'closed':
                    toggleChat(false);
                break;
                default:
                    toggleChat(false);
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }

        return false;
    };

    // イベントハンドラ/onClickChat/
    onClickChat = function(event) {
        changeAnchorPart({
            chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
        });
        return false;
    };
    // ---------- イベントハンドラ終了 ----------

    // ---------- パブリックメソッド開始 ----------
    // パブリックメソッド/initModule/
    initModule = function($container) {
        // HTMLをロードしjQueryコレクションをマッピング
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        // チャットスライダーを初期化、クリックハンドラをバインド
        stateMap.is_chat_retracted = true;
        jqueryMap.$chat
            .attr('title', configMap.chat_retract_title)
            .click(onClickChat);

        // 切り替えテスト
        // setTimeout(function () {
        //         toggleChat(true)
        //     }, 2000
        // );
        // setTimeout(function () {
        //         toggleChat(false)
        //     }, 4000
        // );

        // スキーマを使うようにuriAnchorを設定
        $.uriAnchor.configModule({
            schema_map: configMap.anchor_shema_map
        });

        // 機能モジュールを構成して初期化
        spa.chat.configModule({});
        spa.chat.initModule(jqueryMap.$chat);

        // URIアンカー変更イベントを処理
        // これはすべて機能モジュールを設定して初期化した後に行う
        // そうしないとトリガーイベントを処理できる状態になっていない
        // トリガーイベントはアンカーがロード状態と見なせることを保証するために使う
        // 
        $(window)
            .bind('hashchange', onHashChange)
            .trigger('hashchange');
    };

    return {
        initModule: initModule
    };
    // ---------- パブリックメソッド終了 ----------
}());