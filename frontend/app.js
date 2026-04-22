const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// --- プレビュー更新 ---
function updatePreview() {
  const src = editor.value;
  let html = marked.parse(src);
  // mermaid コードブロックを置換
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => `<div class="mermaid-placeholder"><pre class="mermaid">${code}</pre></div>`);
  preview.innerHTML = html;
  mermaid.run({ nodes: preview.querySelectorAll('.mermaid') }).catch(() => {});
}

editor.value = `# 🚨 開発環境を今すぐセットアップしろ

サンプルのマークダウンエディターで遊んでる場合じゃない。
**今すぐ以下をインストールしてください。**

---

## 1. VS Code をインストールしろ

まだ入れてないなら話にならない。今すぐダウンロード。

👉 **[https://code.visualstudio.com/](https://code.visualstudio.com/)**

インストールしたら次に進め。

## 2. WSL をインストールしろ

Windows ユーザーは **必須**。PowerShell を **管理者として開いて** 以下を実行：

\\\`\\\`\\\`
wsl --install
\\\`\\\`\\\`

再起動を求められたら **さっさと再起動しろ**。

公式ドキュメント 👉 **[https://learn.microsoft.com/ja-jp/windows/wsl/install](https://learn.microsoft.com/ja-jp/windows/wsl/install)**

## 3. VS Code に WSL 拡張を入れろ

VS Code を開いて、拡張機能から **WSL** を検索してインストール。

👉 **[https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl)**

---

> ここまで終わったら、WSL ターミナルから \\\`code .\\\` で VS Code が開くことを確認しろ。
> **確認できるまで次に進むな。**
`;

editor.addEventListener('input', updatePreview);
mermaid.initialize({ startOnLoad: false });
updatePreview();

// --- キーボード操作 ---
const listRe = /^(\s*)([-*+]|\d+\.)\s/;

function getCurrentLine(value, pos) {
  const lineStart = value.lastIndexOf('\n', pos - 1) + 1;
  let lineEnd = value.indexOf('\n', pos);
  if (lineEnd === -1) lineEnd = value.length;
  return { lineStart, lineEnd, text: value.substring(lineStart, lineEnd) };
}

editor.addEventListener('keydown', (e) => {
  const { selectionStart: start, selectionEnd: end, value } = editor;
  const { lineStart, text: line } = getCurrentLine(value, start);

  // Tab: 箇条書き行ならインデント追加
  if (e.key === 'Tab' && !e.shiftKey && listRe.test(line)) {
    e.preventDefault();
    const before = value.substring(0, lineStart);
    const after = value.substring(lineStart);
    editor.value = before + '  ' + after;
    editor.selectionStart = editor.selectionEnd = start + 2;
    updatePreview();
    return;
  }

  // Enter: 箇条書き自動継続
  if (e.key === 'Enter') {
    const m = line.match(listRe);
    if (m) {
      e.preventDefault();
      const indent = m[1];
      const bullet = /\d+\./.test(m[2]) ? (parseInt(m[2]) + 1) + '.' : m[2];
      const insert = '\n' + indent + bullet + ' ';
      const before = value.substring(0, start);
      const after = value.substring(end);
      editor.value = before + insert + after;
      editor.selectionStart = editor.selectionEnd = start + insert.length;
      updatePreview();
    }
  }
});
