# Agents — AIアシスタント用ルール

## 基本ルール
- 作業ファイルは `index.html`（`index-v2.html` は削除済み）
- 全機能は維持（JS/CSS/ID は変更しない）
- コードコメントは追加しない
- 新規関数を追加したら `window.xxx=xxx` でグローバル公開すること（onclick属性から呼べるように）

## プロジェクト状態（2026-07-28）

### 完了した作業
- ✅ `index-v2.html` 削除（`index.html` に統合済み）
- ✅ CSS/JS 外部ファイル分割リファクタリング（インラインCSS→`css/styles.css`、インラインJS→`js/app.js`）
- ✅ Firebase Auth + Firestore 統合（ログイン画面追加、`seminars` コレクション永続化）
- ✅ ログアウトボタン追加（Topbar 右端 🚪）
- ✅ `normalizeRowShape` で `__docId` を保持するよう修正（Firestore CRUD のドキュメントIDが維持される）
- ✅ **fTitle 入力時にドロップダウン即時反映**: `fields.title` の `input` イベントで `selectedRow[fullKeys.title]` を更新し `renderRecordOptions()` を呼ぶ
- ✅ **選択値保持**: `renderRecordOptions()` / `renderMergeOptions()` で `recordSelect` / `mergeRecordSelect` の選択値を rebuild 後も維持
- ✅ **Master Table 行削除ボタン**: 各行に「削除」ボタン追加（11列目「操作」）
- ✅ **Entry Console 削除ボタン**: `control-row` 下部に「削除」ボタン追加（選択中の No を削除）
- ✅ **deleteRecord 関数**: `rawRows` から削除 → `dataRows` 再構築 → 全画面更新 → Firestore 削除（__docId 使用）
- ✅ **レコード未発見時のエラーハンドリング**: `rawIdx<0` で早期リターン
- ✅ **全件削除後にフォームクリア**: `dataRows` が空になったら Entry Console のフィールドをリセット
- ✅ `window.deleteRecord=deleteRecord` でグローバル公開
- ✅ **Task Checklist ✉ → Mail Template 開く**: `openMailTemplate` で `scrollIntoView` の代わりに `scrollToSection` を呼び、折りたたまれたセクションを開くよう修正
- ✅ **Mail Template に .eml 出力ボタン追加**: `downloadMailAsEml` 関数で Outlook 対応 .eml ファイルをダウンロード可能に
- ✅ **Mail Template ボタン並び順・サイズ調整**: 出力→件名＋本文をコピー→クリア の順、すべて `.btn.small`
- ✅ **Training Progress 進捗バー→パイチャート**: conic-gradient のパイチャート + 凡例に変更
- ✅ **Nixie時計を Training Progress 右隣に移動**: `.two-col-grid` で横並び、高さ揃え
- ✅ **Training Progress / 差出人情報 デフォルト開き**: `data-collapsed="false"` + `open` クラス
- ✅ **Training Progress ヒント文言削除**: "Master Tableの進捗100%..." を削除
- ✅ **パイチャート拡大・数値横に配置**: 130px に拡大、`.progress-row` flex で数値サマリー右側に配置

### ファイル別役割
- `index.html`: HTML構造 + ログイン画面（1040行）
- `css/theme-base.css`: CSS変数定義、テーマ切替、ベーススタイル（共有）
- `css/styles.css`: 全コンポーネントスタイル + ログイン画面スタイル（1620行）
- `js/theme-toggle.js`: `SharedTheme` オブジェクトでテーマ切替（共有）
- `js/app.js`: 全アプリケーションロジック（Firebase連携関数含む、2962行）
- `js/firebase-config.js`: Firebase初期化、Auth（login/register/logout）、Firestore CRUD
- `js/csv-utils.js`: CSVパース／エクスポートユーティリティ
- `js/name-lists.js`: 名字辞書
- `js/matrix-rain.js`: 背景マトリックスレインエフェクト

### Firebase 統合に関する注意点
- Firebase **compat SDK** (v10.7.1) 使用 — `type="module"` 不要
- プロジェクト: `seminar-management-app-data`（Auth: email/password, Firestore: collection `seminars`）
- Firestore ドキュメントのフィールドキー = CSV ヘッダー名（`fullKeys` の値）+ `createdBy` / `createdAt` / `updatedAt`
- `__docId` プロパティで Firestore のドキュメントIDを保持（`normalizeRowShape` で自動保存）
- 削除時は `__docId` を使用（`deleteFromFirestore(rawRow.__docId)`）
- `js/app.js` 末尾の `DOMContentLoaded` 内で `FirebaseApp.getCurrentUser()` を再チェック

### 既知の注意点
- `renderConfirm()` / `renderResult()` は削除済みDOM要素を参照しているため、null 安全チェック必須
- 削除済みDOM要素: `confirmCount`, `confirmWarn`, `confirmState`, `checkList`, `resultDone`, `resultHold`, `resultZip`, `folderView`
- 新規関数を追加/編集する際は、必ず `if(els.xxx)` ガードを入れること
- `normalizeRowShape` は `__docId` を自動保存する（他の独自プロパティは消える）

### デバッグ用 grep チェックリスト
```bash
# タブ切替の残骸がないか確認
grep -n "v2-tab\|switchTab\|data-tab" index.html

# サイドバーの data-section と実際のセクションIDが一致しているか確認
grep -n "data-section=" index.html
grep -n 'id="[a-z]*Section\|id="topControlPanel\|id="taskChecklistPanel"' index.html

# section-collapsible が意図通り設定されているか確認
grep -n "section-collapsible" index.html
```

### 作業時の注意
- 大きなHTMLブロックを編集するときは、事前に Read で構造を確認
- 並列Editは競合しやすいので逐次実行推奨
- CSS変更後は必ずレスポンシブブレークポイント（900px / 640px）の影響を確認
- `onclick` 属性から呼ぶ関数は `window.xxx=xxx` で明示的にグローバル公開する
