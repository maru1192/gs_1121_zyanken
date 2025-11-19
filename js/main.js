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
            skillText: "姉さんに責任転嫁して相手のメンタルを削る。",
            playerText: "姉さんだけずるいよ！",
            enemyText: "え、なんで私まで巻き込まれてるの！？"
        },
        tobacchiri: {
            name: "とんだトバッチリだぜぇ！",
            power: 15,
            skillText: "理不尽アピールで相手をひるませる。",
            playerText: "とんだトバッチリだぜぇ！",
            enemyText: "逆になんで私が攻撃されなきゃいけないの！？"
        },
        dash: {
            name: "全力ダッシュ逃げ",
            power: 5,
            skillText: "必死で逃げる。",
            playerText: "やばい、逃げろーー！！",
            enemyText: "ちょっと待ちなさいよ磯野くん！"
        },
        homerun: {
            name: "ホームラン！",
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
            playerText: "カツオくん、覚悟はいい？",
            enemyText: "いってぇぇぇ！！"
        },
        glare: {
            name: "圧のあるガン見",
            power: 10,
            desc: "無言の圧でメンタルにダメージ。",
            playerText: "……じーっ。",
            enemyText: "（目を合わせられねぇ…）"
        },
        hug: {
            name: "強引ハグ",
            power: 15,
            desc: "愛情（？）たっぷりのハグで混乱させる。",
            playerText: "ぎゅーっ！",
            enemyText: "ちょ、ちょっと！みんな見てるって！"
        },
        rage: {
            name: "本気の説教",
            power: 25,
            desc: "10分コースの説教で精神を削る。",
            playerText: "ちょっとそこに座りなさい。",
            enemyText: "（逃げられねぇ…）"
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

    // 攻撃ボタン
    const $skillBtns = $(".skill-btn")


    // ========== 関数の設定 ========== //

    // HPバー関数設定 
    function updateHpBars() {
        const playerHpPercent = state.player.hp / state.player.maxhp * 100;
        const enemyHpPercent = state.enemy.hp / state.enemy.maxhp * 100;

        $playerHpBar.css('width', playerHpPercent + '%')
        $enemyHpBar.css('width', enemyHpPercent + '%')
    }

    // 吹き出しメッセージの関数設定
    function setPlayerMessage(text) {
        $playerMessage.text(text);
    }
    function setEnemyMessage(text) {
        $enemyMessage.text(text);
    }

    // 技名の関数設定
    function updateSkillInfo(move) {
        $skillInfo.html(`<p><strong>${move.name}</strong></p>
                <p>${move.skillText}</p>
            `);
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

        //スキル情報の表示（後で関数定義）
        updateSkillInfo(move);

        //プレイヤーメッセージの表示（後で定義）
        setPlayerMessage(move.playerText);

        //ダメージ計算
        const damage = move.power;
        state.enemy.hp = Math.max(0, state.enemy.hp - damage);
        updateHpBars();

        //倒したかチェック
        if (state.enemy.hp <= 0) {
            setEnemyMessage("ま、まいりました…！");
            setPlayerMessage("僕の勝ちー！");
            return;
        }

        setTimeout(enemyTurn, 800);
    }

    // ====== 敵のターンの設定 ====== //

    function enemyTurn() {
        const enemyMoveKeys = Object.keys(moves.hanazawa);
        const randomIndex = Math.floor(Math.random() * enemyMoveKeys.length);
        const moveKey = enemyMoveKeys[randomIndex];

        const move = moves.hanazawa[moveKey];
        console.log("敵のターン：", moveKey, move);

        // メッセージの表示
        setEnemyMessage(move.enemyText);
        setPlayerMessage(move.playerText);

        //ダメージ計算
        const damage = move.power;
        state.player.hp = Math.max(0, state.player.hp - damage);
        updateHpBars();

        //プレイヤーが倒れた（負けた）かチェック
        if (state.player.hp <= 0) {
            setEnemyMessage("や、やられた〜…");
            setPlayerMessage("磯野くんもまだまだね！");
            return;
        }
        state.isBusy = false;
    }
});