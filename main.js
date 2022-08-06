javascript: (function () {
  const hasNoContent = (line) =>
    !line.textContent || line.id === "version-line-id1";

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

  /**
   * "hoge1"みたいなクラス名から後ろの数字部分（1）を取得する
   * @param className "hoge1"
   * @param prefix "hoge"
   * @returns classNameからprefixを除いた部分（"hoge1" - "hoge" = 1）
   */
  const getSuffixNumber = (className, prefix) =>
    Number.parseInt(className.substr(prefix.length));

  const singleIndent = "  ";
  const ulClass = "list-bullet";
  const olClass = "list-number";
  const isUnorderdList = (line) => line.lastChild.className.startsWith(ulClass);
  const isOrderedList = (line) => line.lastChild.className.startsWith(olClass);

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
  const convertToMarkdown = (line) => {
    let prefix = "";
    if (isUnorderdList(line)) {
      const numOfIndents =
        getSuffixNumber(line.lastChild.className, ulClass) - 1;
      prefix = singleIndent.repeat(numOfIndents) + "* ";

      //読みやすくするため、新しいリストが始まるたびに改行する
      if (numOfIndents === 0) {
        prefix = "\n" + prefix;
      }
    } else if (isOrderedList(line)) {
      const numOfIndents =
        getSuffixNumber(line.lastChild.className, olClass) - 1;
      prefix = singleIndent.repeat(numOfIndents) + "1. ";
    } else if (line.textContent.startsWith("#")) {
      //読みやすくするため、見出し行は改行する
      prefix = "\n";
    }

    return prefix + line.textContent;
  };

  const download = (text, fileName) => {
    const a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.click();
  };

  const main = () => {
    const result = [];
    for (const line of document.querySelectorAll(".ace-line")) {
      if (hasNoContent(line)) {
        continue;
      }

      if (isCommentedOut(line)) {
        continue;
      }

      result.push(convertToMarkdown(line));
    }

    if (result[0].startsWith("\n")) {
      result[0] = result[0].replace("\n", "");
    }

    download(
      result.join("\n"),
      document.getElementById("documentTitle").textContent + ".md"
    );
  };

  main();
})();
