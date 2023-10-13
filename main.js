// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name default.js
// @language_out ECMASCRIPT_2017
// ==/ClosureCompiler==

javascript: (function () {
  const hasContent = (line) => !!line.textContent;

  let commentedOut = false;
  const isCommentedOut = (line) => {
    if (line.textContent === "-->") {
      commentedOut = false;
      return true;
    }

    if (commentedOut) {
      return true;
    }

    if (line.textContent === "<!--") {
      commentedOut = true;
      return true;
    }

    return (
      line.textContent.startsWith("<!--") && line.textContent.endsWith("-->")
    );
  };

  const isList = (line) => /^[U,O]L$/.test(line.tagName);

  const singleIndent = "  ";
  const convertList = (line, indentLevel) => {
    const ret = Array.from(line.children)
      .map((li) => {
        if (li.tagName === "LI") {
          const symbol = line.tagName === "OL" ? "1." : "*";
          const prefix = singleIndent.repeat(indentLevel) + symbol + " ";
          return prefix + li.textContent;
        }

        if (isList(li)) {
          return convertList(li, indentLevel + 1);
        }

        return li.textContent;
      })
      .flat();

    //読みやすくするため、リストが終わるたびに改行する
    if (indentLevel === 0) {
      ret.push("");
    }
    return ret;
  };

  const isHeading = (line) => /^H([1-3])$/.test(line.tagName);

  const convertHeading = (line) => {
    const level = Number.parseInt(line.tagName.substr(1)); // "h1" -> 1
    const prefix = "#".repeat(level) + " ";
    //読みやすくするため、見出し行の後ろに改行を入れる
    return [prefix + line.textContent, ""];
  };

  /**
   * * サポートしているもの：
   *   * 番号付きリスト
   *   * 箇条書き
   * * サポートしていないもの：
   *   * 太字、斜体、下線、取り消し線
   *   * チェックリスト
   *   * 画像
   *   * テーブル
   *   * リンク
   */
  const toMarkdown = (line) => {
    if (isList(line)) {
      return convertList(line, 0);
    }

    if (isHeading(line)) {
      return convertHeading(line);
    }

    return [line.textContent];
  };

  const download = (text, fileName) => {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(
      new Blob([text], {
        type: "text/plain",
      })
    );
    a.click();
  };

  const getLines = () => {
    return Array.from(
      document.querySelector(".editor-content-editable > div").children
    );
  };

  function getTitle() {
    return document.querySelector(".document-title").textContent + ".md";
  }

  const main = () => {
    const result = getLines()
      .filter((line) => hasContent(line) && !isCommentedOut(line))
      .map((line) => toMarkdown(line))
      .flat();

    download(result.join("\n"), getTitle());
  };

  return main();
})();