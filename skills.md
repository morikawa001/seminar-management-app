# Skills

## プロジェクト概要
研修会計画を一元管理するオペレーションプラットフォーム。CSV取込 → ダッシュボード表示 → セッション入力編集 → メール自動生成 → CSV出力、のワークフローを持つ。

## アーキテクチャ

### ファイル構成
```
/
├── index.html            オリジナル（変更不可）
├── index-v2.html         編集中 — v2 レイアウト（単一ページ＋折りたたみ＋固定サイドバー）
├── css/theme-base.css    共有CSSモジュール（変数定義、ベーススタイル）
├── js/theme-toggle.js    テーマ切替（dark/light）
├── js/matrix-rain.js     背景アニメーション
├── js/csv-utils.js       （現状未使用）
├── js/name-lists.js      （現状未使用）
└── skills.md / agents.md  本ドキュメント
```

### CSS設計
- 変数ベース（`var(--bg)`, `var(--text)`, `var(--green)`, `var(--panel2)` 等）
- テーマ切替は `data-theme="dark"|"light"` 属性で制御
- v2 Layout CSS は `<!-- ── v2 Layout CSS ── -->` の `<style>` ブロックに記述

### レイアウト構造（v2）
```
body
├── <canvas>              # 背景アニメーション (fixed, z-index:0)
├── .scanline             # 走査線エフェクト
├── .v2-topbar            # 固定トップバー (sticky top:0, z-index:100)
│   ├── タイトル
│   ├── 統計表示 (Records/Year/Next/DB)
│   └── アクション (CSV/DB作成/サンプル/RecordSelect/テーマ切替)
├── .v2-layout            # flexコンテナ (padding-left:180px)
│   ├── .v2-sidebar       # 固定サイドバー (fixed left:0 top:48px, z-index:2)
│   │   ├── Navigation グループ（10ボタン）
│   │   └── Links グループ（4外部リンク）
│   └── main.v2-main      # メインコンテンツ (flex:1)
│       └── .wrap         # コンテンツラッパー (max-width:1580px)
```

### サイドバーボタン（data-section→section ID対応）
| ボタンラベル       | data-section             | セクションID             |
|-------------------|--------------------------|--------------------------|
| ダッシュボード     | topControlPanel          | topControlPanel          |
| 今日のアクション   | todayCommandSection      | todayCommandSection      |
| 期限アラート       | deadlineAlertSection     | deadlineAlertSection     |
| 新規追加           | quickOperationSection    | quickOperationSection    |
| 入力・編集         | entryConsoleSection      | entryConsoleSection      |
| メール作成         | mailTemplateSection      | mailTemplateSection      |
| タスク管理         | taskChecklistPanel       | taskChecklistPanel       |
| 例外確認           | exceptionQueueSection    | exceptionQueueSection    |
| データ管理         | masterTableSection       | masterTableSection       |
| 管理               | templateInjectionSection | templateInjectionSection |

### セクション構成（表示順）
1. ダッシュボード（ヒーロー, 常時表示）
2. ⚡ 今日の優先アクション（グループラベル）
3. Today Command（デフォルト展開）
4. Deadline Alert（デフォルト展開）
5. Training Progress（デフォルト折りたたみ）
6. 🛠 メイン作業（グループラベル）
7. Quick Operation（デフォルト展開）
8. Sender Info（デフォルト折りたたみ）
9. Nixie Clock（非折りたたみ）
10. Entry Console（デフォルト展開）
11. Computed Schedule（**デフォルト展開**）
12. 📦 補助ツール（グループラベル）
13. Exception Queue（デフォルト折りたたみ）
14. Mail Template（デフォルト折りたたみ）
15. Commit Check（デフォルト折りたたみ）
16. Export Result（デフォルト折りたたみ）
17. Task Checklist（デフォルト折りたたみ）
18. Template Injection（デフォルト折りたたみ）
19. Master Table（デフォルト折りたたみ）

### 削除済みDOM要素（既存、null安全必須）
以下の要素はタブ→単一ページ移行時にHTMLから削除されたが、`els` オブジェクトおよび `renderConfirm()` / `renderResult()` で参照されている。これらへのアクセスは必ず `if(els.xxx)` ガードが必要。
```
confirmCount, confirmWarn, confirmState, checkList
resultDone, resultHold, resultZip, folderView
```
このガードがないと TypeError が発生し、PapaParse コールバック内の後続処理（`renderAlerts`, `renderTodayCommand`, `renderExceptionQueue`, `updateTrainingProgressFromRows` 等）が全てスキップされる。

### 折りたたみメカニズム
- セクションに `.section-collapsible` クラス + `data-collapsed="true/false"` 属性
- CSS: `.section-collapsible:not(.open) > .panel-head ~ * { display:none }`
- トグルボタンは JS で動的生成（`.panel-head` 内に追加）
- `toggleSection(el)` で `.open` クラスをトグル

### JavaScript 主要関数
- `scrollToSection(id)`: 対象セクションを開いてスムーズスクロール + サイドバーアクティブ切替
- `scrollAndOpen(id)`: `scrollToSection` のエイリアス
- `toggleSection(el)`: セクション開閉トグル
- IntersectionObserver: スクロール位置に応じてサイドバーのアクティブ状態を自動更新

### ナビゲーション展開ルール
- 全セクション間ナビゲーション（サイドバー / ヒーローグリッド / panel-nav-actions / Today Command カード内ボタン / Exception Queue「確認する」ボタン）は一律 `scrollToSection()` を使用
- クリック時に該当セクションが展開（`open` クラス追加）されてからスクロールされる
- 通常の `<a href="#sectionId">` アンカーリンクはセクションを展開しないため、使用禁止（`#topControlPanel` を除く。hero-panel は常時表示のため）

### CSV 取込時の動作
- `loadCsv()` で PapaParse 実行 → `currentHeaders` / `rawRows` / `dataRows` 構築
- `renderTable()` → Master Table 描写
- `renderStats()` → 各種統計 + `renderMailRecordOptions()`（Mail Template ドロップダウン）
- `recalcDraft()` → `renderConfirm()` / `renderResult()`（⚠ 削除済みDOM要素へのアクセスは null ガード必須）
- `renderAlerts()` → Deadline Alert（内部で `renderTodayCommand()` / `renderExceptionQueue()` も呼ぶ）
- `renderTodayCommand()` → Today Command カード
- `renderExceptionQueue()` → Exception Queue
- `updateTrainingProgressFromRows(rawRows)` → 研修会全体の進捗
- `renderMergeOptions()` → Template Injection ドロップダウン
- `setTimeout(()=>scrollAndOpen('todayCommandSection'),100)` で Today Command へ自動スクロール＋展開

### クイックアクションボタン（ヒーロー直下）
- 「📝 新規研修会を追加」→ `scrollAndOpen('quickOperationSection')`
- 「✉ メールを作成」→ `scrollAndOpen('mailTemplateSection')`

### ダッシュボードボタン（.hero-btn-grid）
- 2列グリッド（`grid-template-columns:1fr 1fr`）
- 6個の標準リンク + 4個の予備ボタン（合計10個, 2列×5行）
- `.manual-btn` クラス使用
- 予備ボタンは `ondblclick="editSpareUrl(n)"` で URL/ラベル編集可能

### テーマ切替
- `SharedTheme.toggleTheme()` で dark/light 切替
- 初期テーマは `js/theme-toggle.js` で制御
- 保存済み設定がない場合、デフォルトは `dark`（OS設定に依存しない）
- localStorage キー: `theme-preference-v2`（`v1` から変更済み、全環境でダークスタートを強制）

### 命名規則
- CSS クラス: ケバブケース（`.v2-sidebar-btn`, `.section-collapsible`）
- HTML ID: キャメルケースまたはケバブケース（`todayCommandSection`, `entryConsoleSection`）
- JS 関数: キャメルケース（`scrollToSection`, `toggleSection`）
- カスタムデータ属性: `data-section`, `data-collapsed`
