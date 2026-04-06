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

editor.value = `# はじめてのマークダウン

## 見出し
# 大見出し
## 中見出し
### 小見出し

## テキスト装飾
**太字** と *斜体* と ~~取り消し線~~

## リスト
- りんご
- みかん
  - デコポン
  - いよかん
- ぶどう

1. 最初にやること
2. 次にやること
3. 最後にやること

## リンクと画像
[Google](https://www.google.com)

![サンプル画像](https://picsum.photos/300/100)

## 引用
> これは引用文です。

## コード
\`インライン\` と、コードブロック：

\`\`\`
console.log("Hello!");
\`\`\`

## 図（Mermaid）
\`\`\`mermaid
graph LR
    A[開始] --> B[処理]
    B --> C[終了]
\`\`\`
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
