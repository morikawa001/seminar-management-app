# Agents — AIアシスタント用ルール

## Build / Lint / Test
このプロジェクトはビルド・テスト・lint 未使用の vanilla HTML/CSS/JS です。
- `package.json` / `tsconfig.json` / `.eslintrc` などの設定ファイルは**一切不要**
- テストフレームワークなし — 動作確認は `index.html` をブラウザで開く（`npx serve .` などで簡易HTTPサーバ起動推奨）
- lint / format の自動実行は不要（プロジェクトに設定なし）
- 変更後は必ず手動ブラウザリロードで Dark / Light 両テーマで確認

## ファイル構成
```
index.html                    # HTML構造 + ログイン画面（1046行）
css/theme-base.css            # CSS変数定義・テーマ切替・ベーススタイル（49行）
css/styles.css                # 全コンポーネントスタイル（1623行）
js/theme-toggle.js            # SharedTheme オブジェクト（IIFE, 19行）
js/firebase-config.js         # Firebase Auth + Firestore CRUD（IIFE, 116行）
js/app.js                     # 全アプリケーションロジック（2963行, 最大ファイル）
js/csv-utils.js               # CSV パース・エクスポート（IIFE, 92行）
js/name-lists.js              # 名字辞書
js/matrix-rain.js             # 背景マトリックスレインエフェクト
QR_reader.html                # QRコード出席管理（別ページ、Firebase ES Module, 653行）
```
**読み込み順（重要）**: theme-base.css → styles.css → 外部CDN → theme-toggle.js → firebase-config.js → app.js → csv-utils.js → name-lists.js → matrix-rain.js

## コードスタイルガイドライン

### 全般
- **コメント禁止**: コードコメントは一切追加しない（既存コメントも削除しない）
- **既存ID/クラス名は変更禁止**: 全機能は ID ベースで DOM 参照しているため、id 属性の変更・削除は厳禁
- **新規関数は `window.xxx=xxx` でグローバル公開**: `onclick` 属性から呼べるようにする（例: `window.openMailPrep=openMailPrep`）
- **eventListener は DOMContentLoaded 内でアタッチ**: `onclick` 属性を使わないボタンは `DOMContentLoaded` 内でアタッチする

### JavaScript 規約
- **変数**: camelCase（`dataRows`, `selectedRow`, `currentHeaders`）
- **定数**: UPPER_SNAKE_CASE または先頭大文字（`KEY`, `DB_COLLECTION`, `TASK_IDS`）
- **関数名**: camelCase（`generateMailTemplate`, `scrollToSection`）
- **データフィールドキー（CSVヘッダー）**: snake_case（`fullKeys.title`, `fullKeys.date`）
- **var と const/let 混在**: 新しいコードは `const` / `let` を使用（既存コードの `var` はそのまま維持）
- **モジュールなし**: IIFE パターンでスコープ隔離（`(function(){ ... })()`）
- **null安全**: DOM要素取得後は必ず `if(el)` ガード（削除済み要素参照を防止）
- **Firestore ドキュメントID**: `__docId` プロパティで保持（`normalizeRowShape` が自動保存）

### HTML 規約
- **セクション構造**: `<section class="panel section-collapsible" data-collapsed="true|false">`
- **折りたたみ**: `data-collapsed="false"` のセクションは `.open` クラス必須
- **ID命名**: パネルは `xxxSection`（例: `mailTemplateSection`）、入力フィールドは `fXxx`（例: `fTitle`）
- **sidebar 連動**: 各セクションの ID と `.v2-sidebar-btn[data-section="..."]` は一致させる
- **onclick 関数**: グローバル公開済みの関数のみ呼び出す
- **セクションラベル**: `.corner-label` を最初の子要素に配置

### CSS 規約
- **CSS変数**: `var(--xxx)` でテーマ対応（dark/light 両方で視認性確認必須）
- **セレクタ**: クラスセレクタ優先（`#mailTemplateSection` などの ID セレクタは既存のみ）
- **ブレークポイント**: 900px（タブレット） / 640px（スマホ）でレスポンシブ確認
- **テーマ変数は theme-base.css のみ**: styles.css では `var(--xxx)` を使ってテーマ変数を参照
- **ボタンクラス**: `.btn` → `.btn.small` / `.btn.primary` の組み合わせ
- **グリッドレイアウト**: `.two-col-grid` / `.mini-grid` / `.master-grid` パターン使用

### エラーハンドリング
- DOM要素の null チェック: `const el=document.getElementById('x'); if(!el) return;`
- 削除済みDOM要素の参照禁止: `renderConfirm()` / `renderResult()` 内で `if(els.xxx)` ガードを必ず入れる
- 削除済み要素一覧: `confirmCount`, `confirmWarn`, `confirmState`, `checkList`, `resultDone`, `resultHold`, `resultZip`, `folderView`
- Firebase エラー: `.catch(function(err){ console.error('...', err); })`
- レコード未発見: `rawIdx<0` で早期リターン
- Firestore 保存前に `currentUser` チェック: `if(!currentUser) return Promise.reject('Not logged in')`

### Firebase 統合
- **compat SDK v10.7.1**: CDN 経由, `type="module"` 不要
- **プロジェクトID**: `seminar-management-app-data`
- **コレクション**: `seminars`（`createdBy` フィールドでユーザー分離）
- **CRUD**: `FirebaseApp.loadFromFirestore()` / `FirebaseApp.saveToFirestore()` / `FirebaseApp.deleteFromFirestore()`
- **ログイン状態**: `FirebaseApp.getCurrentUser()` で確認
- **ログイン後の初期化**: `onFirebaseLogin(user)` 関数が全ての画面を再描画

## 注意事項
- 大きなHTMLブロック編集前に Read で構造確認
- 並列Editは競合しやすいので逐次実行推奨
- CSS変更後は必ず 900px / 640px ブレークポイントの影響を確認
- 変更後はコミットして push する（ユーザーが明示的に要求した場合のみ）

## デプロイ（GitHub Pages）同期について
- **GitHub Pages は `morikawa001/seminar` リポジトリ（`main` ブランチ）から配信**されている
  - URL例: `https://morikawa001.github.io/seminar/live_session.html`
- 本リポジトリ（`seminar-management-app` / origin）への push だけでは**デプロイに反映されない**
- `seminar` リポジトリ側の `main` ブランチに同期が必要。手順:
  1. `git worktree add --detach ../seminar-publish seminar/main`
  2. 変更ファイル（例: `live_session.html` 等）を `../seminar-publish/` へコピー
  3. `git -C ../seminar-publish add ファイル && git -C ../seminar-publish commit -m "..."`
  4. `git -C ../seminar-publish push seminar HEAD:main`
  5. `git worktree remove ../seminar-publish --force`（OneDrive ロックで失敗時は `rm -rf` + `git worktree prune`）
- 公開対象のページのみ同期する（`seminar` リポジトリは公開用の独立ページのみ収録。`index.html` / `js/app.js` / `css/` は含まれない）

## 変更履歴

### 2026-08-01: QR_reader.html のモードボタン縦配置と保管場所の即時DB保存
- ✅ モード切替ボタンを縦積み配置に変更（上: 📦 保管場所QR / 下: 📄 ファイルQR）し、全幅・同高でバランス調整
- ✅ 保管場所QRスキャン時に読み込み済みの起案レコードがあれば、`qr_storage_loc` を即座に Firestore へ保存（`updateStorageLocation()` / `saveLocation()`）
- ✅ 保存ボタン押下前に場所をスキャンした場合は従来通り「まとめて保存」、保存後に場所をスキャンしてもDBに残るように修正

### 2026-08-01: QR_reader.html に「ファイルQR／保管場所QR」の2モード対応＋保管場所の記録
- ✅ スキャン画面にモード切替チップ（📄 ファイルQR / 📦 保管場所QR）を追加（`setScanMode()`）
- ✅ ファイルQR（起案行No）は従来通り DB 検索、保管場所QR はテキスト（例: `管理棟４階　書庫A-1`）として `this.currentLoc` に一時保持
- ✅ 保管場所QRが未スキャンでもエラーにしない（場所が空なら日付のみ保存）
- ✅ 実施日保存ボタン（起案1/2/3）押下時に、日付とスキャン済み保管場所をまとめて保存（`updateSaveDateWithLocation()` / `recordSaveDate(field, docId, locStr)`）
- ✅ 保管場所は起案レコードの新フィールド `qr_storage_loc` に保存、解除（再クリック）時は日付のみ削除で場所は保持
- ✅ 結果カードに「保管場所」表示を追加（`#result-loc-value`）、スキャン済み保管場所ボックス（`#current-loc-box`）とクリアボタン（`clearCurrentLoc()`）を追加
- ✅ スキャン成功時・保存成功時に保管場所をメッセージへ反映

### 2026-08-01: qr_maker.html で URL だけでなく単純な文字データも QR コード化可能に
- ✅ `ensureProtocol()`（https:// 自動付与）と `new URL()` による URL 形式チェックを廃止
- ✅ 入力値をそのまま生テキストとして QR コードにエンコード（URL は URL として、`管理棟４階　書庫A-1` のような文字データもそのまま変換）
- ✅ ラベルを「TARGET URL / TEXT」に変更、placeholder とエラーメッセージを文字データ対応に更新

### 2026-08-01: live_session.html の選択セレクトで重複行を除外し No 昇順ソート
- ✅ `buildSelect()` を修正：`起案行No` が同一の重複行は初回のみ表示（`Set` で重複除外）、No なし行は末尾に配置
- ✅ 表示順を `起案行No` 昇順ソートに変更（No が 1 から順に並ぶ）
- ✅ `buildSelect()` が表示対象の行インデックス配列を返すようにし、CSV・Firebase DB 双方の読み込み後は先頭（No最小）の行を自動ロード

### 2026-08-01: attend.html / kenshukai-notion-csv-generator.html の背景を index.html と同一演出に変更
- ✅ 両ファイルの文字マトリックス雨（`#matrix-bg` / `#bgCanvas`）を廃止し、index.html と同じ「コード列が上から下に流れる」背景（`#bgCodeCanvas`）に置換
- ✅ CSS・canvas ID・レンダリングスクリプト（HTMLソース行を縦カラムで流す＋グリッド＋ノード）を license.html と同様に index.html と完全一致させた
- ✅ テーマ切替・機能ロジック等の他部分は変更なし

### 2026-07-29: 研修会準備ボタン・Task 24 メールボタン追加
- ✅ Mail Template セクションに「研修会準備」ボタン追加（`#mailPrepBtn`, `onclick="openMailPrep()"`）
- ✅ `openMailPrep()` 関数を作成（Entry Console の No を読み取り `openMailTemplate(no,'cohost','seminar_prep')` を呼ぶ）
- ✅ Task 24（研修会本番）に ✉ メールボタン追加（`onclick="openTaskMail('24')"`）
- ✅ `openTaskMail()` に `'24':{recipient:'cohost',purpose:'seminar_prep'}` マッピング追加
- ✅ `seminar_prep` テンプレートを以下のように更新：
  - `preMeeting`（開始30分前）を動的に使用
  - 各項目を改行区切りで整形（準備開始／事前打合せ／会場／モニタリング依頼）
  - 署名ブロックを `senderName` ＋アスタリスク囲み `senderSig` に変更

### 2026-07-29: ZIP一括出力のフォルダ振り分け対応
- ✅ mergeAllTemplatesZip() の出力ロジックを修正：ファイル名の先頭XX_プレフィックスごとにフォルダに振り分け
- ✅ 例: 01_01_起案.docx → 01/ フォルダ、01_02_チラシ案.docx → 01/ フォルダ
- ✅ プレフィックス不一致のファイルは 不明/ フォルダにまとめる

### 2026-07-29: live_session.html が index.html のデータを自動継承
- ✅ `saveDataToLocalStorage()` 関数を app.js に追加（currentHeaders + rawRows を localStorage に保存）
- ✅ データ読み込み完了時に自動保存（Firebaseログイン後・CSV読込後）
- ✅ live_session.html 起動時に localStorage を確認し、データがあれば自動反映
- ✅ ファイル選択がなくても index.html のデータベースが live_session.html に引き継がれる
- ✅ DOMContentLoaded 対応で起動時の読み込みを安定化

### 2026-07-29: Master Table 削除・移動・CSV重複行の修正
- ✅ `buildDisplayRowsFromRaw` の sort を `_order||...` → `_order!=null?...` に修正（`_order=0` を falsy 扱いしない）
- ✅ `commitDraft` 更新パスで `_order` が未定義/0 の時に正の値を計算して代入（`_order||0` を廃止）
- ✅ `moveRow` の swap で両行に有効な `_order` がない場合、現在位置に基づく値を新規割り当て
- ✅ Master Table 行の onclick で action（`deleteRecord`/`moveRow`）を `event.stopPropagation()` より先に実行
- ✅ `downloadCsv()` で出力前に No の重複を排除（`rawRows` をそのまま使わず Set で重複除去）

### 2026-07-30: QR_reader.html 作成＋Computed Schedule 保存済み連携
- ✅ `QR_reader.html` を新規追加（Firebase Auth + Firestore を ES Module で直接利用、別ページ）
- ✅ QRコード読み取り（カメラスキャン・ファイルアップロード）＋起案行No手動検索
- ✅ 保存ボタンを「起案１」「起案２」「起案３」の3つに分割、各々 `qr_saved_k1/k2/k3` を Firestore に記録
- ✅ 再クリックで保存解除（トグル動作）
- ✅ Computed Schedule に「保存済み」チェックボックス追加（`#ckK1Saved/ckK2Saved/ckK3Saved`、disabled）
- ✅ `applyScheduleChecksFromRow` で `qr_saved_k1/k2/k3` の有無を判定して自動反映
- ✅ `schedule-card` のグリッドレイアウト修正（`grid-template-columns: 1fr auto`）、`schedule-actions` コンテナで縦積み
- ✅ `fullKeys` に `qrK1Saved/qrK2Saved/qrK3Saved` 追加、CSVヘッダーに `qr_saved_k1/k2/k3` 追加
- ✅ QR_reader.html のUIをメインアプリに統一（`theme-base.css` + `styles.css` 読み込み、`.panel` / `.btn.primary` 使用）
- ✅ QR_reader.html タイトルを「QRファイル管理」に変更
- ✅ `color-mix` の非互換対応 → 深緑 `#0d2818` 背景＋明るいグリーン文字に変更（結果カード・履歴リスト）
- ✅ `button { background: none }` が html5-qrcode 内部ボタンに干渉 → `#qr-reader button:not(.btn)` で上書き
- ✅ `new Html5Qrcode()` をページ読み込み即実行→ `ensureQrReader()` による遅延初期化に変更（`display:none` 起因のエラー回避）
- ✅ `schedule-card` グリッドを `1fr auto auto` → `1fr auto` に戻し、`.schedule-actions` コンテナで縦積み
- ✅ QRコードパネルのラベルを「QR Attendance Code」→「QR File Code」、「出席登録用QRコード」→「ファイル管理用QRコード」に修正

### 2026-07-31: Master Table にガントチャート切替機能
- ✅ Master Table のパネルヘッダーに「📊 ガントチャート」切替ボタンを追加
- ✅ `toggleMasterView()` 関数でテーブル／ガントチャートを切り替え
- ✅ `renderGanttChart()` を新規作成（月間グリッド＋マイルストーンドット、完了チェックは半透明で表示）
- ✅ ガントチャート凡例：起案1（青）／HP公開（緑）／開催日（赤）／起案2（橙）／起案3（紫）

### 2026-07-31: live_session.html のFirebase Firestore連携
- ✅ Firebase compat SDK + firebase-config.js を読み込み
- ✅ ログイン画面（`#loginSection`）を追加（`login()` / `register()` は既存の firebase-config.js を利用）
- ✅ `onFirebaseLogin` で `FirebaseApp.loadFromFirestore()` からデータを読み込みセレクトボックスに反映
- ✅ `onFirebaseLogout` でデータ・UI をクリア
- ✅ ステータスバーにログアウトボタンを追加
- ✅ ログイン済み再チェック対応（`index.html` と同じパターン）
- ✅ CSV/XLSX アップロードも従来通り併用可能

### 2026-07-31: 保存してCSVをDLの不具合修正＋変更を保存ボタン追加
- ✅ トップバーの「💾 保存してDL」ボタン（`saveAndDownloadBtn`）が無効のままだった問題を修正（全データ読込経路で有効化）
- ✅ `commitDraft()` が保存成功時のみ `true` を返すように変更（検証失敗時はCSVをDLしない）
- ✅ Entry Console に保存専用ボタン「💾 変更を保存」（`#saveChangesBtn`）を追加
- ✅ **更新時の `__docId` 欠落バグを修正**: `buildRow()` で新規構築した行に `__docId` が引き継がれず、編集保存で Firestore に新規ドキュメントが追加され続けていた（リロード時に重複・旧データが優先される問題）。`commitDraft` 更新パスで `__docId`・`_order`・フォーム外カラム（`qr_saved_k1/k2/k3`・`DONEAT_*`・`UPDATEDAT_*`・`HISTORY_*` など）を既存行から引き継ぐように修正
- ✅ **新規追加直後の `__docId` 未記録バグを修正**: `saveToFirestore()` の `.add()` で発行されたドキュメントIDを行に記録し、以降の編集で `.set()` により上書き更新されるように修正（新規追加→編集の繰り返しで重複ドキュメントが増える問題を解消）
- ✅ **読み込み時の重複Noを最新更新日で解決**: `loadFromFirestore()` で `updatedAt` を取得し、`dedupeRowsByNo()` で同一Noの重複行は `updatedAt` が最新のドキュメントを優先。過去のバグで蓄積した重複ドキュメントがリロード時に旧データを表示する問題を解消
- ✅ ファビコン（`favicon.ico` 404）対策としてインラインSVGファビコンを追加

### 2026-07-31: Psycho-Pass モチーフ「SIBYL SYSTEM / 公安局」デザイン改修（機能変更なし）
- ✅ `theme-base.css` をブラック×ブルー基調の公安局カラーに刷新（`--green` 等の変数名は維持、値のみ変更。JS/HTMLの参照は無変更）
- ✅ `styles.css` のハードコード色をブルー系へ（heroタイトル光・Nixie時計をブルー/シアンのグローに・statusピル・manual-btn のライトテーマ色）
- ✅ `matrix-rain.js` / `app.js` の背景コードレイン・グリッド・ノードをブルーサイバー色に変更
- ✅ `index.html` に SIBYL SYSTEM ブランディング追加（トップバー・ログイン画面・hero見出し・corner-label・サイドバーラベル・ファビコンを青に）
- ✅ トップバータイトル・hero に SIBYL SYSTEM パルスドット（`sibyl-status` / `@keyframes sibyl-pulse`）を追加
- ✅ `QR_reader.html` のインライン配色（結果カード・履歴リスト・バッジ）をブルー基調に変更＋見出しに SIBYL SYSTEM 追加
- ✅ `live_session.html` の BLACK/WHITE 両テーマをブルー基調に刷新（グリーン系 `rgba(0,200,83,*)`・`#39ff14`・`#2e7d52` 等をブルーへ置換）＋見出し・タイトルを SIBYL SYSTEM 表記に
- ⚠️ 対象はメインアプリ（`index.html` / `QR_reader.html` / `live_session.html` / `css` / `js`）。外部公開用の独立ページ（`seminar.html` / `attend.html` / `license.html` / `operator_manual.html` / `participant_management_panel.html` / `SilenceCutPro.html`）は未変更
