// アイコン画像ファイル名のリスト
const iconFiles = [
    'user1.jpg',
    'user2.png',
    'user3.png'
    // 必要に応じて追加
];

// アイコンを表示するコンテナを取得
const iconContainer = document.getElementById('icon-container');
// 会えた人の状態（クリックしたかどうか）をローカルストレージから取得
let metList = JSON.parse(localStorage.getItem('metList') || '{}');

// ビンゴ画像の表示・非表示を切り替える関数
function updateBingoOverlay() {
    // metListの中でtrue（会えた）になっている数を数える
    const metCount = Object.values(metList).filter(Boolean).length;
    const overlay = document.getElementById('bingo-overlay');
    // 3つ以上会えたらビンゴ画像を表示、それ以外は非表示
    if (metCount >= 3) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// 各アイコン画像を順番に表示
iconFiles.forEach(file => {
    // アイコンとスタンプをまとめるラッパーdivを作成
    const wrapper = document.createElement('div');
    wrapper.className = 'icon-wrapper';

    // アイコン画像を作成
    const img = document.createElement('img');
    img.src = `icons/${file}`;
    img.alt = file;
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    // 会えた場合は緑色の枠、そうでない場合は影だけ
    img.style.boxShadow = metList[file]
        ? '0 0 0 4px #4caf50, 0 2px 8px rgba(0,0,0,0.1)'
        : '0 2px 8px rgba(0,0,0,0.1)';
    img.style.cursor = 'pointer';

    // スタンプ画像を作成（初期は非表示）
    const stamp = document.createElement('img');
    stamp.src = 'icons/stamp.png';
    stamp.className = 'stamp';
    if (metList[file]) stamp.style.display = 'block';

    // アイコン画像をクリックしたときの処理
    img.addEventListener('click', () => {
        // 状態を反転（会えた⇔会えてない）
        metList[file] = !metList[file];
        // 状態をローカルストレージに保存
        localStorage.setItem('metList', JSON.stringify(metList));
        // 枠やスタンプの表示を切り替え
        img.style.boxShadow = metList[file]
            ? '0 0 0 4px #4caf50, 0 2px 8px rgba(0,0,0,0.1)'
            : '0 2px 8px rgba(0,0,0,0.1)';
        stamp.style.display = metList[file] ? 'block' : 'none';
        // ビンゴ判定
        updateBingoOverlay();
    });

    // ラッパーにアイコン画像とスタンプ画像を追加
    wrapper.appendChild(img);
    wrapper.appendChild(stamp);
    // コンテナにラッパーを追加
    iconContainer.appendChild(wrapper);
});

// ページ読み込み時にもビンゴ判定を実行
updateBingoOverlay();

// ビンゴ画像（bingo.png）をクリックしたときだけ全画面表示を閉じる
// event.stopPropagation()で親要素のクリックイベントを止める
// これにより画像の上だけで閉じる動作になる
const bingoImg = document.getElementById('bingo-img');
bingoImg.addEventListener('click', function(event) {
    document.getElementById('bingo-overlay').classList.remove('show');
    event.stopPropagation();
});