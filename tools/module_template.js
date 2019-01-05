/*
 * module_template.js
 * ブラウザ機能モジュール用のテンプレート
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 4,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa */

spa.module = (function () {

    //---------------- モジュールスコープ変数開始 --------------
    var configMap = {
            settable_map : { color_name: true },
            color_name   : 'blue'
        },
        stateMap  = { $container : null },
        jqueryMap = {},

        setJqueryMap, configModule, initModule;
    //----------------- モジュールスコープ変数終了 ---------------

    //------------------- ユーティリティメソッド開始 ------------------
    getTrimmedString = function(text) {};
    //------------------- ユーティリティメソッド終了 ------------------

    //--------------------- DOMメソッド開始 --------------------
    // DOMメソッド/setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = { $container : $container };
    };
    //--------------------- DOMメソッド終了 --------------------

    //------------------- イベントハンドラ開始 -------------------
    onClickButton = function(event) {};
    //------------------- イベントハンドラ終了 -------------------



    //------------------- パブリックメソッド開始 -------------------
    // パブリックメソッド/configModule/
    // 目的：
    // 引数：設定可能なキーバリューマップ
    //   * color_name - 使用する色
    // 設定：
    //   * configMap.settable_map 許可されたキーを宣言する
    // 戻り値：true
    // 例外発行：なし
    //
    configModule = function ( input_map ) {
        spa.butil.setConfigMap({
            input_map    : input_map,
            settable_map : configMap.settable_map,
            config_map   : configMap
        });
        return true;
    };

    // パブリックメソッド/initModule/
    // 目的：モジュールを初期化する
    // 引数：設定可能なキーバリューマップ
    //   * $container - この機能が使うjQuery要素
    // 戻り値：true
    // 例外発行：なし
    //
    initModule = function ( $container ) {
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    };

    // パブリックメソッドを返す
    return {
        configModule : configModule,
        initModule   : initModule
    };
    //------------------- パブリックメソッド終了 -------------------
}());
