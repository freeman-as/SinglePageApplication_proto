/*
 * spa.util_b.js
 * javascriptブラウザユーティリティ
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 4,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa, getComputedStyle */

spa.util_b = (function () {
    'use strict';

    //---------------- モジュールスコープ変数開始 --------------
    var configMap = {
            regex_encode_html  : /[&"'><]/g,
            regex_encode_noamp : /["'><]/g,
            html_encode_map    : {
                '&' : '&#38;',
                '"' : '&#34;',
                "'" : '&#39;',
                '>' : '&#62;',
                '<' : '&#60;'
            }
        },

        decodeHtml, encodeHtml, getEmSize;

        configMap.encode_noamp_map = $.extend(
            {}, configMap.html_encode_map
        );
        delete configMap.encode_noamp_map['&'];
    //----------------- モジュールスコープ変数終了 ---------------

    //------------------- ユーティリティメソッド開始 ------------------
    // ユーティリティメソッド/decodeHtml/
    // htmlエンティティをブラウザに適した方法で出コードする
    // http://stackoverflow.com/questions/1912501/\
    //   unescape-html-entities-in-javascriptを参照
    // 
    decodeHtml = function(str) {
        return $('<div/>').html(str || '').text();
    };

    // ユーティリティメソッド/encodeHtml/
    // これはhtmlエンティティのための単一パスエンコーダーであり、
    // 任意の文字に対応する
    // 
    encodeHtml = function(input_arg_str, exclude_amp) {
        var input_str = String(input_arg_str),
            regex, lookup_map;

        if (exclude_amp) {
            lookup_map = configMap.encode_noamp_map;
            regex = configMap.regex_encode_noamp;
        }
        else {
            lookup_map = configMap.html_encode_map;
            regex = configMap.regex_encode_html
        }
        return input_str.replace(regex,
            function(match, name) {
                return lookup_map[match] || '';
            }
        );
    };

    // ユーティリティメソッド/getEmSize/
    // emのサイズをピクセルで返す
    // 
    getEmSize = function(elem) {
        return Number(
            getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
        );
    };
    //------------------- ユーティリティメソッド終了 ------------------

    //------------------- パブリックメソッド開始 -------------------

    // パブリックメソッドを返す
    return {
        decodeHtml: decodeHtml,
        encodeHtml: encodeHtml,
        getEmSize: getEmSize,
    };
    //------------------- パブリックメソッド終了 -------------------
}());
