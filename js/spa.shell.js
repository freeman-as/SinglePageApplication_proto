/*
 * spa.shell.js
 * SPAのシェルモジュール
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 4,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : true,
  white  : true
*/
/* global $, spa */

spa.shell = (function () {
    // ---------- モジュールスコープ変数開始 ----------
    var configMap = {
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
                + '<div class="spa-shell-modal"></div>'
        },
        stateMap = { $container: null },
        jqueryMap = {},

        setJqueryMap, initModule;
    // ---------- モジュールスコープ変数終了 ----------

    // ---------- ユーティリティメソッド開始 ----------
    // ---------- ユーティリティメソッド終了 ----------

    // ---------- DOMメソッド開始 ----------
    // DOMメソッド/setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = { $container: $container };
    };
    // ---------- DOMメソッド終了 ----------
    
    // ---------- イベントハンドラ開始 ----------
    // ---------- イベントハンドラ終了 ----------

    // ---------- パブリックメソッド開始 ----------
    // パブリックメソッド/initModule/
    initModule = function($container) {
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();
    }

    return {
        initModule: initModule
    };
    // ---------- パブリックメソッド終了 ----------
}());