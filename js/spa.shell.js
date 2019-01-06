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
    'use strict';
    // ---------- モジュールスコープ変数開始 ----------
    var configMap = {
            anchor_shema_map: {
                chat: {
                    opened: true,
                    closed: true,
                },
            },
            main_html: String()
                + '<div class="spa-shell-head">'
                    + '<div class="spa-shell-head-logo">'
                        + '<h1>SPA</h1>'
                        + '<p>javascript end to end</p>'
                    + '</div>'
                    + '<div class="spa-shell-head-acct"></div>'
                + '</div>'
                + '<div class="spa-shell-main">'
                    + '<div class="spa-shell-main-nav"></div>'
                    + '<div class="spa-shell-main-content"></div>'
                + '</div>'
                + '<div class="spa-shell-foot"></div>'
                + '<div class="spa-shell-modal"></div>',
            resize_interval: 200,
        },
        stateMap = {
            $container: undefined,
            anchor_map: {},
            resize_idto: undefined,
        },
        jqueryMap = {},

        copyAnchorMap, setJqueryMap,
        changeAnchorPart, onHashChange, onResize,
        onTapAcct, onLogin, onLogout,
        setChatAnchor, initModule;

    // ---------- モジュールスコープ変数終了 ----------

    // ---------- ユーティリティメソッド開始 ----------
    // 格納したアンカーマップのコピーを返す。オーバーヘッドを最小限にする。
    copyAnchorMap = function () {
        return $.extend(true, {}, stateMap.anchor_map);
    };
    // ---------- ユーティリティメソッド終了 ----------

    // ---------- DOMメソッド開始 ----------
    // DOMメソッド/setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $acct: $container.find('.spa-shell-head-acct'),
            $nav: $container.find('.spa-shell-main-nav'),
        };
    };

    // DOMメソッド/changeAnchorPart/
    // 目的：URIアンカー要素部分を変更
    // 引数：
    //   * arg_map - 変更したいURIアンカー部分を表すマップ
    // 戻り値：boolean
    //   * true - URIのアンカー部分更新
    //   * false - URIのアンカー部分更新失敗
    // 動作：
    //   現在のアンカーをstateMap.anchor_mapに格納
    //   エンコーディングの説明はuriAnchorを参照
    //   このメソッドは
    //    * copyAnchorMap()を使って子のマップのコピーを作成
    //    * arg_mapを使ってキーバリューを修正
    //    * uriAnchorを使ってURIの変更を試みる
    //    * 成功時にはtrue、失敗時にはfalse
    // 
    changeAnchorPart = function(arg_map) {
        var anchor_map_revise = copyAnchorMap(),
            bool_return = true,
            key_name, key_name_dep;

        // アンカーマップへ変更を統合
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
                }
                else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }

        // URIの更新。成功しなければ元に戻す
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
    //   * event - jQueryイベントオブジェクト
    // 設定：なし
    // 戻り値：false
    // 動作：
    //   * URIアンカー要素を解析
    //   * 提示されたアプリケーション状態と現在の状態を比較
    //   * 提示された状態が既存の状態と異なり、アンカースキーマで
    //   * 許可されている場合のみ、アプリケーションを調整
    // 
    onHashChange = function(event) {
        var _s_chat_previous, _s_chat_proposed, s_chat_proposed,
            anchor_map_proposed,
            is_ok = true,
            anchor_map_previous = copyAnchorMap();

        // アンカーの解析を試みる
        // console.log('am_previous:' + JSON.stringify(anchor_map_previous));
        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
            // console.log('am_proposed:' + JSON.stringify(anchor_map_proposed));
        } catch(error) {
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
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
                case 'opened':
                    is_ok = spa.chat.setSliderPosition('opened');
                break;
                case 'closed':
                    is_ok = spa.chat.setSliderPosition('closed');
                break;
                default:
                    spa.chat.setSliderPosition('closed');
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }

        // スライダーの変更が拒否された場合にアンカーを元に戻す
        if (! is_ok) {
            if (anchor_map_previous) {
                $.uriAnchor.setAnchor(anchor_map_previous, null, true);
                stateMap.anchor_map = anchor_map_previous;
            }
            else {
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }

        return false;
    };

    // イベントハンドラ/onResize/
    onResize = function () {
        if (stateMap.resize_idto) {
            return true;
        }

        spa.chat.handleResize();
        stateMap.resize_idto = setTimeout(
            function () {
                stateMap.resize_idto = undefined;
            },
            configMap.resize_interval
        );

        // preventDefault(), stopPropagation()を実行しないようにする
        return true;
    };

    onTapAcct = function(event) {
        var acct_text, user_name,
            user = spa.model.people.get_user();

        if (user.get_is_anon()) {
            user_name = prompt('Please sign-in');
            spa.model.people.login(user_name);
            jqueryMap.$acct.text('... processing ...');
        }
        else {
            spa.model.people.logout();
        }
        return false;
    };

    onLogin = function(event, login_user) {
        jqueryMap.$acct.text(login_user.name);
    };

    onLogout = function(event, logout_user) {
        jqueryMap.$acct.text('Please sign-in');
    };
    // ---------- イベントハンドラ終了 ----------

    // ---------- コールバック開始 ----------
    // コールバックメソッド/setChatAnchor/
    // 用例：setChatAnchor('closed');
    // 目的：アンカーのチャットコンポーネントを変更
    // 引数：
    //   * position_type - [closed]または[opened]
    // 動作：
    //   可能ならURIアンカーパラメータ[chat]を要求に変更する
    // 戻り値：
    //   * true - 要求されたアンカー部分が更新された
    //   * false - 要求されたアンカー部分が更新されなかった
    // 例外：なし
    // 
    setChatAnchor = function(position_type) {
        return changeAnchorPart({ chat: position_type });
    };
    // ---------- コールバック終了 ----------

    // ---------- パブリックメソッド開始 ----------
    // パブリックメソッド/initModule/
    // 用例：spa.shell.initModule($('#div_id'));
    // 目的：ユーザーに機能を提供するようにチャットに指示する
    // 引数：
    //   * $append_target - 1つのDOMコンテナを表すjQueryコレクション
    // 動作：
    //   $containerにUIのシェルを含め、機能モジュールを構成して初期化する
    //   シェルはURIアンカーやCookieの管理などのブラウザ全体に及ぶ問題を担当する
    // 戻り値：なし
    // 例外発行：なし
    //
    initModule = function($container) {
        // HTMLをロードしjQueryコレクションをマッピング
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

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
        spa.chat.configModule({
            set_chat_anchor: setChatAnchor,
            chat_model: spa.model.caht,
            people_model: spa.model.people,
        });
        spa.chat.initModule(jqueryMap.$container);

        // URIアンカー変更イベントを処理
        // これはすべて機能モジュールを設定して初期化した後に行う
        // そうしないとトリガーイベントを処理できる状態になっていない
        // トリガーイベントはアンカーがロード状態と見なせることを保証するために使う
        // 
        $(window)
            .bind('resize', onResize)
            .bind('hashchange', onHashChange)
            .trigger('hashchange');

        $.gevent.subscribe($container, 'spa-login', onLogin);
        $.gevent.subscribe($container, 'spa-logout', onLogout);

        jqueryMap.$acct
            .text('Please sign-in')
            .bind('utap', onTapAcct);
    };

    return {
        initModule: initModule
    };
    // ---------- パブリックメソッド終了 ----------
}());