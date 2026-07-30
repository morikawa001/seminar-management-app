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

## 変更履歴

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
