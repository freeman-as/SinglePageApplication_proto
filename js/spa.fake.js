/*
 * spa.fake.js
 * フェイクモジュール
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 4,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa */

spa.fake = (function () {
    'use strict';
    var getPeopleList, fakeIdSerial, makeFakeId, mockSio;

    fakeIdSerial = 5;

    makeFakeId = function () {
        return 'id_' + String(fakeIdSerial++);
    };

    peopleList = [
        {
            name: 'Betty',
            _id: 'id_01',
            css_map: {
                top: 20,
                left: 20,
                'background-color': 'rgb( 128, 128, 128)',
            }
        },
        {
            name: 'Mike',
            _id: 'id_02',
            css_map: {
                top: 60,
                left: 20,
                'background-color': 'rgb( 128, 255, 128)',
            }
        },
        {
            name: 'Pebbles',
            _id: 'id_03',
            css_map: {
                top: 100,
                left: 20,
                'background-color': 'rgb( 128, 192, 192)',
            }
        },
        {
            name: 'Wilma',
            _id: 'id_04',
            css_map: {
                top: 140,
                left: 20,
                'background-color': 'rgb( 192, 128, 128)',
            }
        }
    ];

    mockSio = (function () {
        var on_sio, emit_sio,
            send_listchange, listchange_idto,
            callback_map = {};

        on_sio = function(msg_type, callback) {
            callback_map[msg_type] = callback;
        };

        emit_sio = function(msg_type, data) {
            var person_map;

            // 3秒間の遅延後に[userupdate]コールバックで[adduser]イベントに応答する
            // 
            if (msg_type === 'adduser' && callback_map.userupdate) {
                setTimeout(function () {
                    person_map = {
                        _id: makeFakeId(),
                        name: data.name,
                        css_map: data.css_map,
                    };
                    peopleList.push(person_map);
                    callback_map.userupdate([person_map]);
                }, 3000);
            }
        };

        // 1秒に1回listchangeコールバックを使うようにする
        // 一度成功したら止める
        // 
        send_listchange = function () {
            listchange_idto = setTimeout(function () {
                if (callback_map.listchange) {
                    callback_map.listchange([peopleList]);
                    listchange_idto = undefined;
                }
                else {
                    send_listchange();
                }
            }, 1000);
        };

        // 処理を開始する必要がある
        send_listchange();

        return {
            emit: emit_sio,
            on: on_sio,
        };
    }());

    return {
        mockSio: mockSio,
    };
}());
