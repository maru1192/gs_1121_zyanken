// ====== キャラクターステータスの設定 ====== //
const state = {
    player: {
        name: "カツオ",
        maxhp: 100,
        hp: 100
    },
    enemy: {
        name: "花沢さん",
        maxhp: 100,
        hp: 100
    },

    isBusy: false,    // アニメ中など、処理中フラグ
    isFinished: false // バトルが終わったかどうか
};

// ====== キャラクターの技リスト ====== //
const moves = {
    katsuo: {
        nesanZurui: {
            name: "姉さんずるいよ！",
            power: 10,
            skillText: "責任転嫁して相手のメンタルを削る。",
            playerText: "姉さんだけずるいよ！",
            enemyText: "え、なんで私まで巻き込まれてるの！？"
        },
        tobacchiri: {
            name: "とんだトバッチリ",
            power: 15,
            skillText: "理不尽アピールで相手をひるませる。",
            playerText: "とんだトバッチリだぜぇ！",
            enemyText: "逆になんで私が攻撃されなきゃいけないの！？"
        },
        dash: {
            name: "全力ダッシュ",
            power: 5,
            skillText: "必死で逃げる。",
            playerText: "やばい、逃げろーー！！",
            enemyText: "ちょっと待ちなさいよ磯野くん！"
        },
        homerun: {
            name: "フルスイング",
            power: 30,
            skillText: "フルスイングで大ダメージを与える",
            playerText: "ホームラーン！！",
            enemyText: "ぐふっ…いいスイングね…。"
        },
    },
    hanazawa: {
        naguri: {
            name: "グーパンチ",
            power: 18,
            desc: "ストレートパンチ",
            playerText: "いってぇぇぇ！！",
            enemyText: "磯野くん、覚悟はいい？"
        },
        glare: {
            name: "圧のあるガン見",
            power: 10,
            desc: "無言の圧でメンタルにダメージ。",
            playerText: "（目を合わせられねぇ…）",
            enemyText: "……じーっ。"
        },
        hug: {
            name: "強引ハグ",
            power: 15,
            desc: "愛情（？）たっぷりのハグで混乱させる。",
            playerText: "ちょ、ちょっと！みんな見てるって！",
            enemyText: "ぎゅーっ！"
        },
        rage: {
            name: "本気の説教",
            power: 25,
            desc: "10分コースの説教で精神を削る。",
            playerText: "（逃げられねぇ…）",
            enemyText: "ちょっとそこに座りなさい。"
        }
    }
};





// ====== jQueryで変数要素を取得 ====== //
$(function () {
    // HPゲージ
    const $playerHpBar = $("#player-hp-bar");
    const $enemyHpBar = $("#enemy-hp-bar");

    // 攻撃時のメッセージ
    const $playerMessage = $("#player-message");
    const $enemyMessage = $("#enemy-message");

    // コマンド内容の解説
    const $skillInfo = $("#skill-info");
    const $skillName = $("#skill_name");
    const $skillDesc = $("#skill_desc");

    // 攻撃ボタン
    const $skillBtns = $(".skill-btn")


    // ====== タイプライター風表示用の関数 ====== //

    function typeText($el, text, speed = 40, callback) {
        const prevTimerId = $el.data('typeTimerId');
        if (prevTimerId) {
            clearInterval(prevTimerId);
        }

        $el.text('');
        var i = 0;

        const timerId = setInterval(function () {
            $el.text(text.slice(0, i + 1));
            i++;

            if (i >= text.length) {
                clearInterval(timerId);
                $el.removeData('typeTimerId')
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }, speed);

        $el.data('typeTimerId', timerId);
    }



    // ====== ボタンにカーソルを合わせた時の設定 ====== //
    $skillBtns.hover(
        function () {
            const moveKey = $(this).data("move");
            const move = moves.katsuo[moveKey]

            $skillName.html(`${move.name}`);
            $skillDesc.html(`${move.skillText}`);
        },
        function () {
            $skillName.html(``);
            $skillDesc.html(``);
        }
    );




    // ========== 関数の設定 ========== //

    // HPバー関数設定 
    function updateHpBars() {
        const playerHpPercent = state.player.hp / state.player.maxhp * 100;
        const enemyHpPercent = state.enemy.hp / state.enemy.maxhp * 100;

        $playerHpBar.css('width', playerHpPercent + '%')
        $enemyHpBar.css('width', enemyHpPercent + '%')
    }

    // 吹き出しメッセージの関数設定
    function setPlayerMessage(text, callback) {
        $(".player_fukidasi").fadeIn(200);
        typeText($playerMessage, text, 40, callback);
    }

    function setEnemyMessage(text, callback) {
        $(".enemy_fukidasi").fadeIn(200);
        typeText($enemyMessage, text, 40, callback);
    }



    // ====== 技ボタンのクリックイベント作成（自分のターン） ====== //
    $skillBtns.on("click", function () {
        if (state.isBusy || state.isFinished) return;

        const moveKey = $(this).data("move");
        handlePlayerMove(moveKey);
    });

    function handlePlayerMove(moveKey) {
        const move = moves.katsuo[moveKey];
        if (!move) return;

        state.isBusy = true;

        // ① まずカツオのメッセージ
        setPlayerMessage(move.playerText, function () {

            // ② カツオのタイプ終了後、花沢さんのメッセージ
            setEnemyMessage(move.enemyText, function () {

                // ③ ダメージ計算
                const damage = move.power;
                state.enemy.hp = Math.max(0, state.enemy.hp - damage);
                updateHpBars();

                // ④ 倒したかチェック
                if (state.enemy.hp <= 0) {
                    // 勝利演出も順番に
                    setEnemyMessage("ま、まいりました…！", function () {
                        setPlayerMessage("僕の勝ちー！", function () {
                            state.isFinished = true;
                            state.isBusy = false;
                        });
                    });
                    return; // ここで敵ターンに進まないように止める
                }

                // ⑤ 生きていれば、少し待ってから敵ターンへ
                setTimeout(enemyTurn, 800);
            });
        });
    }


    // ====== 敵のターンの設定 ====== //

    function enemyTurn() {
        const enemyMoveKeys = Object.keys(moves.hanazawa);
        const randomIndex = Math.floor(Math.random() * enemyMoveKeys.length);
        const moveKey = enemyMoveKeys[randomIndex];

        const move = moves.hanazawa[moveKey];
        console.log("敵のターン：", moveKey, move);

        // メッセージの表示
        setEnemyMessage(move.enemyText, function () {
            setPlayerMessage(move.playerText, function () {

                //ダメージ計算
                const damage = move.power;
                state.player.hp = Math.max(0, state.player.hp - damage);
                updateHpBars();

                //プレイヤーが倒れた（負けた）かチェック
                if (state.player.hp <= 0) {
                    setEnemyMessage("磯野くんもまだまだね！", function () {
                        setPlayerMessage("や、やられた〜…", function () {
                            state.isBusy = false;
                            state.isFinished = true;
                        });
                    });
                    return;
                }
                state.isBusy = false;
            });
        });
    }
});