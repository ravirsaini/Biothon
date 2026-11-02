const KEYWORDS = new Set([
  "and",
  "as",
  "class",
  "def",
  "elif",
  "else",
  "False",
  "for",
  "from",
  "if",
  "import",
  "in",
  "None",
  "not",
  "or",
  "return",
  "True",
  "with",
])

type Token = { kind: "plain" | "keyword" | "string" | "comment" | "number" | "call"; text: string }

function tokenize(line: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < line.length) {
    const char = line[index]

    if (char === "#") {
      tokens.push({ kind: "comment", text: line.slice(index) })
      break
    }

    if (char === '"' || char === "'") {
      let end = index + 1
      while (end < line.length && line[end] !== char) end += 1
      const closed = end < line.length
      tokens.push({ kind: "string", text: line.slice(index, closed ? end + 1 : line.length) })
      index = closed ? end + 1 : line.length
      continue
    }

    if (/[A-Za-z_]/.test(char)) {
      let end = index + 1
      while (end < line.length && /[A-Za-z0-9_]/.test(line[end])) end += 1
      const word = line.slice(index, end)
      const kind = KEYWORDS.has(word) ? "keyword" : line[end] === "(" ? "call" : "plain"
      tokens.push({ kind, text: word })
      index = end
      continue
    }

    if (/\d/.test(char) && (index === 0 || !/[A-Za-z_]/.test(line[index - 1]))) {
      let end = index + 1
      while (end < line.length && /[\d.]/.test(line[end])) end += 1
      tokens.push({ kind: "number", text: line.slice(index, end) })
      index = end
      continue
    }

    tokens.push({ kind: "plain", text: char })
    index += 1
  }

  return tokens
}

const tokenClass: Record<Token["kind"], string> = {
  plain: "text-[#f3efe6]",
  keyword: "text-[#8fd0b0]",
  string: "text-[#e7c27a]",
  comment: "text-[#8ea199]",
  number: "text-[#e29478]",
  call: "text-[#d7ebe3]",
}

export function PythonCode({ code }: { code: string }) {
  const lines = code.split("\n")

  return (
    <pre className="overflow-x-auto bg-[#142421] px-4 py-4 font-mono text-[13px] leading-6 text-[#f3efe6]">
      <code>
        {lines.map((line, lineIndex) => (
          <span key={`${lineIndex}-${line}`} className="block">
            {line.length === 0
              ? "\u00a0"
              : tokenize(line).map((token, tokenIndex) => (
                  <span key={`${lineIndex}-${tokenIndex}`} className={tokenClass[token.kind]}>
                    {token.text}
                  </span>
                ))}
          </span>
        ))}
      </code>
    </pre>
  )
}
