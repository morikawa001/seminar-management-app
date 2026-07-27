# Agents — AIアシスタント用ルール

## 基本ルール
- 作業ファイルは `index-v2.html`（`index.html` は変更不可）
- 全機能は維持（JS/CSS/ID は変更しない）
- コードコメントは追加しない
- 変更後は `.v2-tab` / `switchTab` / `data-tab` の残存を grep 確認すること

## プロジェクト状態（2026-07-26）

### 完了した作業
- ✅ `index-v2.html` を `index.html` からコピー作成
- ✅ v2 Topbar / Sidebar / Main レイアウト構築
- ✅ タブ切替方式（v2-tab + switchTab）から単一ページ縦並び＋折りたたみ方式に移行完了
- ✅ 全 `.v2-tab` ラッパー削除
- ✅ 全セクションに `.section-collapsible` + `data-collapsed` 属性追加
- ✅ セクショングループラベル追加（⚡今日の優先アクション / 🛠メイン作業 / 📦補助ツール）
- ✅ クイックアクションボタン追加（新規研修会追加 / メール作成）
- ✅ サイドバー: `position:sticky` → `position:fixed` に変更
- ✅ ダッシュボードボタン: 2列グリッド化＋左右幅縮小
- ✅ CSV取込後に Today Command へ自動スクロール＋展開
- ✅ `scrollToSection()` に対象セクション自動展開ロジック統合
- ✅ IntersectionObserver でスクロール位置に応じたサイドバーアクティブ表示
- ✅ i 重複ID `spareBtn5` → `spareBtn6` に修正
- ✅ Master Table を seminar-manager.html 準拠の `<table>` 形式に変更（10列: No/開催日/テーマ/対象/会場/進捗/起案1/HP/起案2/起案3）
- ✅ **CSV取込バグ修正**: `renderConfirm()` / `renderResult()` に null 安全チェック追加 — 削除済みDOM要素（`confirmCount`, `resultDone` 等）へのアクセスでTypeErrorが発生し、以降の描写関数（`renderTodayCommand`, `renderAlerts`, `renderExceptionQueue`, `updateTrainingProgressFromRows`）が全てスキップされる問題を修正
- ✅ **サンプルボタン修正**: `dummyDataBtn` に `loadDummyData` のイベントリスナーが未結線だった問題を修正
- ✅ **デフォルトダークモード**: `theme-toggle.js` の `getPreferredTheme()` で保存済み設定がない場合 `'dark'` を返すよう変更 + localStorage キーを `theme-preference-v2` に変更して全環境強制リセット
- ✅ **全ナビゲーション展開＋スクロール**: ヒーローグリッドボタン、各セクション `panel-nav-actions`、Today Command カード内ボタン、Exception Queue「確認する」ボタン — 全て `scrollToSection()` でセクション展開後にスクロールするよう統一
- ✅ **Task Checklist を panel-nav-actions に追加**: Today Command / Entry Console / Exception Queue / Mail Template の4セクションに Task Checklist へのナビゲーションリンクを追加
- ✅ **Computed Schedule デフォルト展開**: `data-collapsed="true"` → `"false"` + `open` クラス追加

### 現在の設計判断と理由
| 判断 | 理由 |
|------|------|
| タブ切替廃止 → 全セクション縦並び | ユーザーから「タブ切替は使い勝手が悪い」とFB |
| サイドバー fixed + v2-layout padding-left | position:sticky が期待通り動作しなかったため |
| Quick Operation / Entry Console はデフォルト展開 | ユーザーが頻繁に使用するため |
| Today Command / Deadline Alert はデフォルト展開 | 優先度の高い情報のため |
| その他セクションはデフォルト折りたたみ | 画面の情報量を減らすため |
| セクション折りたたみは sibling セレクタ | HTML 構造を変更せずに実装可能なため |

### 既知の注意点
- `.section-collapsible:not(.open) > .panel-head ~ *` の CSS は `.panel-head` 以降の兄弟要素のみ非表示にする
- Task Checklist は独自の内部トグル（`toggleTaskBody()`）を持つが、外側のセクション折りたたみと併用可能
- Nixie Clock（`#nixieClockPanel`）は `.section-collapsible` クラスなし（常時表示）
- ヒーローパネル（`#topControlPanel`）は常時表示
- `renderConfirm()` / `renderResult()` は削除済みDOM要素を参照しているため、null 安全チェック必須。TypeErrorが発生すると PapaParse コールバック内の後続処理全体が停止する。
- HTML から削除された `els.*` 要素にアクセスする関数を追加/編集する際は、必ず `if(els.xxx)` ガードを入れること。

### ファイル別役割
- `index-v2.html`: 全HTML + CSS + JS が同一ファイルに集約（SPA的構成）
- `css/theme-base.css`: CSS変数定義、テーマ切替、ベーススタイル（共有）
- `js/theme-toggle.js`: `SharedTheme` オブジェクトでテーマ切替（共有）

### デバッグ用 grep チェックリスト
```bash
# タブ切替の残骸がないか確認
grep -n "v2-tab\|switchTab\|data-tab" index-v2.html

# サイドバーの data-section と実際のセクションIDが一致しているか確認
grep -n "data-section=" index-v2.html
grep -n 'id="[a-z]*Section\|id="topControlPanel\|id="taskChecklistPanel"' index-v2.html

# section-collapsible が意図通り設定されているか確認
grep -n "section-collapsible" index-v2.html
```

### 作業時の注意
- 大きなHTMLブロックを編集するときは、事前に Read で構造を確認
- 並列Editは競合しやすいので逐次実行推奨
- CSS変更後は必ずレスポンシブブレークポイント（900px / 640px）の影響を確認
