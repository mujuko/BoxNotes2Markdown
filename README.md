# BoxNotes2Markdown

Box Notesをマークダウン形式に変換してダウンロードするスクリプトです。

ブックマークレットにするつもりでしたがiframeとCORSの壁に阻まれたので諦めました。  
不格好ですが、コンソールにコピペして使います。

## 変換ルール

| 変換前                    | 変換後                |
| ------------------------- | --------------------- |
| ・ 箇条書き               | `* {箇条書き}`        |
| 1. 番号付きリスト         | `1. {番号付きリスト}` |
| インデント                | 半角スペース 2 つ     |
| `<!-- HTMLのコメント -->` | 出力しない※           |
| 上記以外                  | そのまま              |

※ `<!--`から`-->`まで無視するので、複数行コメントも使用可能です

## 使い方

1. Box Notes を開きます
1. 開発者ツールのコンソールを開きます
1. スクリプトがノートの iframe 内で実行されるように設定します
   - Firefox: `Box Notes`を選択（インスペクターでノート内の適当な要素をクリックするとよい）  
     https://firefox-source-docs.mozilla.org/devtools-user/working_with_iframes/index.html
   - Chrome: `service_iframe (note) `を選択  
     https://developer.chrome.com/docs/devtools/console/reference/#context
1. スクリプトをコピペして実行します

## 制約

- Box Notes はクロスオリジンな iframe を使っているため、ブックマークレットとして使用することはできません

## 謝辞

本スクリプトのコンパイル（minify）には Google Closure Compiler を使用しています

- https://closure-compiler.appspot.com
- https://github.com/google/closure-compiler
