const mode = process.argv[2];

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const { tool_input } = JSON.parse(input);

  if (mode === "file") {
    checkFile(tool_input);
  } else if (mode === "bash") {
    checkBash(tool_input);
  }
});

function block(reason) {
  process.stderr.write(`BLOCKED: ${reason}\n`);
  process.exit(2);
}

function checkFile(toolInput) {
  const filePath = (toolInput.file_path || toolInput.path || "")
    .replace(/\\/g, "/")
    .toLowerCase();

  const basename = filePath.split("/").pop();

  if (basename === ".env" || basename.startsWith(".env.")) {
    block("Cannot access .env files — they contain secrets.");
  }

  if (filePath.includes("prisma/migrations/")) {
    block("Cannot modify migration files — use prisma migrate instead.");
  }

  const sensitivePatterns = ["secret", "credential", "password"];
  for (const pattern of sensitivePatterns) {
    if (basename.includes(pattern)) {
      block(`Cannot access files containing "${pattern}" in the name.`);
    }
  }
}

function checkBash(toolInput) {
  const cmd = (toolInput.command || "").toLowerCase();

  const dangerous = [
    { pattern: "rm -rf", reason: "Recursive delete is not allowed." },
    { pattern: "git push --force", reason: "Force push is not allowed." },
    { pattern: "git push -f", reason: "Force push is not allowed." },
    { pattern: "git reset --hard", reason: "Hard reset is not allowed." },
    { pattern: "drop table", reason: "DROP TABLE is not allowed." },
    { pattern: "delete from", reason: "DELETE FROM is not allowed." },
    {
      pattern: "prisma migrate reset",
      reason: "Database reset is not allowed.",
    },
  ];

  for (const { pattern, reason } of dangerous) {
    if (cmd.includes(pattern)) {
      block(reason);
    }
  }
}
