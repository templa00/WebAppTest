/**
 * @file		App.js
 * @brief		アプリケーション管理
 * @date		2019/11/23
 */


// ロード完了後初期化
window.addEventListener("load", Init);
// リサイズイベント登録
window.addEventListener("resize", Resize);

// パーティクル管理用配列
var particles = [];

// 初期化
function Init() {

    // キャンバスを作成
    this.stage = new createjs.Stage("Canvas");

    // タッチ操作をサポートしているブラウザーならば
    if (createjs.Touch.isSupported() == true) {
        // タッチ操作を有効にします。
        createjs.Touch.enable(this.stage);
    }

    // クリックイベントを登録
    this.stage.addEventListener("stagemousedown", OnMouseDown);
    this.stage.addEventListener("stagemouseup", OnMouseUp);
    this.stage.addEventListener("stagemousemove", OnMouseMove);

    // 更新処理
    // tick イベント(更新処理)の登録
    createjs.Ticker.framerate = 60;//60フレーム

    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // 更新イベントの設定
    createjs.Ticker.addEventListener("tick", Update);

    Resize();
}

function Resize() {
    // リサイズ処理
    // 画面幅・高さを取得
    this.window_w = window.innerWidth;
    this.window_h = window.innerHeight;
    // stage要素の大きさを画面幅・高さに合わせる
    this.stage.canvas.width = this.window_w;
    this.stage.canvas.height = this.window_h;

    // ウィンドウサイズとコースの基準サイズの比率を計算する
    let ratio_w = this.window_w / 720;
    let ratio_h = this.window_h / 1280;

    this.scale = 1;

    // 倍率が低い方を設定
    if (ratio_h <= ratio_w) {
        this.scale = ratio_h;
    }
    else if (ratio_h > ratio_w) {
        this.scale = ratio_w;
    }

    this.screen_width = 720 * this.scale;
    this.screen_height = 1280 * this.scale;

    this.offset_x = Math.ceil((this.window_w - (screen_width)) / 2);
    this.offset_y = Math.ceil((this.window_h - (screen_height)) / 2);

    // コンテナー(グループの親)を作成
    let container = new createjs.Container();
    container.x = this.offset_x;
    container.y = this.offset_y;
    stage.addChild(container); // 画面に追加

    // 背景スクリーン描画
    let bgScreen = new createjs.Shape();
    bgScreen.graphics.beginFill("Black");
    bgScreen.graphics.drawRect(0, 0, this.screen_width, this.screen_height);
    container.addChild(bgScreen);
}

// パーティクル生成
function CreateParticles() {
    // パーティクルの生成
    for (var i = 0; i < 5; i++) {
        // オブジェクトの作成
        var particle = new createjs.Shape();
        particle.graphics
            .beginFill(createjs.Graphics.getHSL(50, 50, 50))
            .drawCircle(0, 0, 30 * Math.random());
        stage.addChild(particle);
        particle.compositeOperation = "lighter";
        // パーティクルの発生場所
        particle.x = stage.mouseX;
        particle.y = stage.mouseY;

        // 移動方向と速度を設定
        particle.vx = 30 * (Math.random() - 0.5);
        particle.vy = 30 * (Math.random() - 0.5);
        // 寿命の時間を設定
        particle.life = 40;
        particles.push(particle);
    }
}
// パーティクル更新
function UpdateParticles() {
    // パーティクルの計算を行う
    for (var i = 0; i < particles.length; i++) {
        // オブジェクトの作成
        var particle = particles[i];
        // 重力
        particle.vy += 1;
        // 摩擦
        particle.vx *= 0.96;
        particle.vy *= 0.96;
        // 速度を位置に適用
        particle.x += particle.vx;
        particle.y += particle.vy;
        // パーティクルのサイズをライフ依存にする
        var scale = particle.life / 40;
        particle.scaleX = particle.scaleY = scale;
        // 寿命を減らす
        particle.life -= 1;

        // 寿命の判定
        if (particle.life <= 0) {
            // ステージから削除
            stage.removeChild(particle);
            // 配列からも削除
            particles.splice(i, 1);
        }
    }
}

// マウスダウン
function OnMouseDown(event) {
    console.log("OnMouseDown");
}

// マウスアウト
function OnMouseUp(event) {
    console.log("OnMouseUp");
}

// マウスムーブ
function OnMouseMove(event) {
    console.log("OnMouseMove");
}

//時間（秒）
var sec = 0;

// 更新
function Update(event) {
    /*
    // TODO:1秒跳ぶ可能性を考える？
    // TODO:secを0.1秒間隔でほしい
    if (Math.floor(event.time / 1000) == sec + 1) {
        console.log(sec + "秒");
        console.log("約1秒間の更新回数" + (createjs.Ticker._ticks - (60 * sec)));
        console.log("約1秒間のフレームレート」" + (createjs.Ticker._ticks - (60 * sec)) / 60);
        sec += 1;
    }
    */
    // パーティクルを発生
    CreateParticles();
    // パーティクルを更新
    UpdateParticles();

    // 更新
    this.stage.update();
}