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
            main_html: String()
                + '<div>Module</div>',
            settable_map : { color_name: true },
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
    // 目的：許可されたキーの構成を調整する
    // 引数：設定可能なキーバリューマップ
    //   * input_map - 
    // 設定：
    //   * configMap.settable_map 許可されたキーを宣言する
    // 戻り値：true
    // 例外発行：なし
    //
    configurateModule = function ( input_map ) {
        spa.util.setConfigMap({
            input_map    : input_map,
            settable_map : configMap.settable_map,
            config_map   : configMap
        });
        return true;
    };

    // パブリックメソッド/initModule/
    // 目的：モジュールを初期化する
    // 引数：
    //   * $container - この機能が使うjQuery要素
    // 戻り値：true
    // 例外発行：なし
    //
    initModule = function ( $container ) {
        $container.html(configMap.main_html);
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    };

    // パブリックメソッドを返す
    return {
        configurateModule: configurateModule,
        initModule: initModule
    };
    //------------------- パブリックメソッド終了 -------------------
}());
