# Skills

## プロジェクト概要
研修会計画を一元管理するオペレーションプラットフォーム。CSV取込 → ダッシュボード表示 → セッション入力編集 → メール自動生成 → CSV出力、のワークフローを持つ。Firebase Auth + Firestore で複数端末間のデータ永続化を実現。

## アーキテクチャ

### ファイル構成
```
/
├── index.html            メインHTML（編集対象、1024行）
├── css/theme-base.css    共有CSSモジュール（変数定義、ベーススタイル）
├── css/styles.css        全コンポーネントスタイル + ログイン画面
├── js/theme-toggle.js    テーマ切替（SharedTheme）
├── js/app.js             全アプリケーションロジック（2876行）
├── js/firebase-config.js Firebase初期化 + Auth + Firestore CRUD
├── js/csv-utils.js       CSVパース／エクスポートユーティリティ
├── js/name-lists.js      名字辞書（現状未使用）
├── js/matrix-rain.js     背景アニメーション
├── skills.md             本ドキュメント
└── AGENTS.md             AIアシスタント用ルール
```

### CSS設計
- 変数ベース（`var(--bg)`, `var(--text)`, `var(--green)` 等）
- テーマ切替は `data-theme="dark"|"light"` 属性 + `theme-base.css` の変数定義
- 全コンポーネントスタイルは `styles.css` に集約

### レイアウト構造
```
body
├── <canvas>              # 背景アニメーション (fixed, z-index:0)
├── .scanline             # 走査線エフェクト
├── #loginSection         # ログイン画面 (z-index:10, 未ログイン時のみ表示)
├── #appContainer         # メインアプリ (ログイン後に表示)
│   ├── .v2-topbar        # 固定トップバー (sticky, z-index:100)
│   │   ├── タイトル + 統計
│   │   └── アクション群 (CSV/DB作成/サンプル/No選択/開く/テーマ/保存DL/ログアウト)
│   └── .v2-layout        # flexコンテナ
│       ├── .v2-sidebar   # 固定サイドバー (fixed left, ナビゲーション10 + リンク4)
│       └── main.v2-main  # メインコンテンツ
│           └── .wrap     # コンテンツラッパー (max-width:1580px)
```

### セクション一覧（縦並び＋折りたたみ）
| セクション | ID | デフォルト |
|-----------|-----|-----------|
| ダッシュボード | topControlPanel | 常時表示 |
| Today Command | todayCommandSection | 展開 |
| Deadline Alert | deadlineAlertSection | 展開 |
| Training Progress | trainingProgressPanel | 折りたたみ |
| Quick Operation | quickOperationSection | 展開 |
| Sender Info | senderInfoSection | 折りたたみ |
| Nixie Clock | nixieClockPanel | 常時表示 |
| Entry Console | entryConsoleSection | 展開 |
| Computed Schedule | computedScheduleSection | 展開 |
| Exception Queue | exceptionQueueSection | 折りたたみ |
| Mail Template | mailTemplateSection | 折りたたみ |
| Task Checklist | taskChecklistPanel | 折りたたみ |
| Template Injection | templateInjectionSection | 折りたたみ |
| Master Table | masterTableSection | 折りたたみ |

### JavaScript 主要関数

| 関数 | 役割 |
|------|------|
| `loadCsv(e)` | CSVファイルをパースしてデータ読み込み |
| `loadDummyData()` | サンプルデータ4件を生成 |
| `loadSelectedIntoForm()` | 選択行のデータをEntry Consoleに反映 |
| `commitDraft()` | フォーム内容を保存（rawRows更新 + Firestore保存） |
| `deleteRecord(no)` | 指定Noのレコードを削除（rawRows/dataRows/Firestore） |
| `renderRecordOptions()` | 全No選択ドロップダウンを再構築（選択値維持） |
| `renderTable()` | Master Tableを再描写（11列、削除ボタン含む） |
| `recalcDraft()` | フォーム入力に応じて派生フィールドを再計算 |
| `renderTodayCommand()` | Today Command カードを更新 |
| `renderAlerts()` | Deadline Alert を更新 |
| `normalizeRowShape(row)` | 行データをcurrentHeadersで正規化（__docId保持） |
| `buildDisplayRowsFromRaw(rows)` | rawRows → dataRows 変換（フィルタ+ソート+重複除去） |

### Firestore CRUD フロー

**読み込み** (`onFirebaseLogin`):
1. `FirebaseApp.loadFromFirestore(headers, callback)`
2. Firestore ドキュメント → `rows` 配列（各要素に `__docId` + ヘッダーキー）
3. `rows.map(r => normalizeRowShape(r))` → `rawRows`（`__docId` は保持）
4. `buildDisplayRowsFromRaw(rawRows)` → `dataRows`
5. 各レンダリング関数で画面更新

**保存** (`commitDraft`):
1. `buildRow()` → フォームから行データ作成
2. `rawRows` を更新（新規追加 or 上書き）
3. `FirebaseApp.saveToFirestore(rawRow, currentHeaders)` → Firestore に set() or add()
4. `__docId` があれば既存ドキュメント更新、なければ新規作成

**削除** (`deleteRecord`):
1. `rawRows.findIndex()` → `splice()` で削除
2. `dataRows` 再構築 → 全画面更新
3. `rawRow.__docId` があれば `FirebaseApp.deleteFromFirestore(__docId)` でFirestore削除
4. なければ `FirebaseApp.deleteFromFirestore(no)` でフォールバック

### 削除機能

**Master Table**: 各行の「操作」列の「削除」ボタン → `onclick="deleteRecord(no)"`

**Entry Console**: `control-row` 下部の「削除」ボタン → 現在 `fNo` に入力中の No を削除

**deleteRecord(no)** の内部処理:
1. `confirm()` ダイアログ表示
2. `rawRows` から該当行を検索 → `splice()` で削除
3. `dataRows` を再構築
4. `renderRecordOptions()` / `renderTable()` / 他全画面更新
5. Firestore からも削除（`__docId` を優先使用）
6. 全件削除後にフォームフィールドをクリア
7. `window.deleteRecord=deleteRecord` でグローバル公開済み

### CSS変数キー
- `--bg`, `--text`, `--text-strong`, `--muted`, `--faint`
- `--panel`, `--panel2`, `--panel3`, `--line`, `--line2`
- `--green`, `--cyan`, `--warn`, `--danger`, `--success`
- `--input-bg`, `--button-bg`, `--button-primary-bg`
- `--radius`, `--shadow`, `--glow`

### テーマ切替
- `SharedTheme.toggleTheme()` で dark/light 切替
- デフォルト: dark（localStorage キー: `theme-preference-v2`）
- Nixie Clock のスタイルもテーマに追従

### レイアウトブレークポイント
- 1100px: two-col-grid 調整
- 900px: サイドバー縮小（テキスト非表示, アイコンのみ）
- 640px: サイドバー横スクロール、全グリッド1列
- 480px: モバイル最適化（余白削減、フォント縮小）

### 命名規則
- CSS クラス: ケバブケース（`.v2-sidebar-btn`, `.section-collapsible`）
- HTML ID: キャメルケースまたはケバブケース
- JS 関数: キャメルケース
- カスタムデータ属性: `data-section`, `data-collapsed`
