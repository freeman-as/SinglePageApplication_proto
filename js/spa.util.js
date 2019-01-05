/*
 * spa.util.js
 * 汎用javascriptユーティリティ
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 4,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa */

spa.util = (function () {

    var makeError, setConfigMap;

    //------------------- パブリックコンストラクタ開始 -------------------
    // パブリックコンストラクタ/makeError/
    // エラーオブジェクトを作成する便利なラッパー
    // 引数：
    //   * name_text - エラー名
    //   * msg_text - 長いエラーメッセージ
    //   * data - エラーオブジェクトに付加するオプションデータ
    // 戻り値：新たに作成されたエラーオブジェクト
    // 例外発行：なし
    //
    makeError = function(name_text, msg_text, data) {
        var error = new Error();
        error.name = name_text;
        error.message = msg_text;

        if (data) {
            error.data = data;
        }

        return error;
    };

    //------------------- パブリックメソッド開始 -------------------
    // パブリックメソッド/configModule/
    // 目的：許可されたキーの構成を調整する
    // 引数：
    //   * input_map - 構成するキーバリューマップ
    //   * settable_map - 構成できるキーのマップ
    //   * config_map - 構成を適用するマップ
    // 戻り値：true
    // 例外発行：入力キーが許可されていない場合は例外を発行する
    //
    setConfigMap = function ( arg_map ) {
        var input_map    = arg_map.input_map,
            settable_map = arg_map.settable_map,
            config_map   = arg_map.configMap,
            key_name, error;

        for (key_name in input_map) {
            if (input_map.hasOwnProperty(key_name)) {
                if (settable_map.hasOwnProperty(key_name)) {                   
                    config_map[key_name] = input_map[key_name];
                }
                else {
                    error = makeError('Bad Input',
                        'Setting configkey |' + key_name + '| is not supported'
                    );
                    throw error;
                }
            }
        }
    };

    // パブリックメソッドを返す
    return {
        makeError: makeError,
        setConfigMap: setConfigMap,
    };
    //------------------- パブリックメソッド終了 -------------------
}());
