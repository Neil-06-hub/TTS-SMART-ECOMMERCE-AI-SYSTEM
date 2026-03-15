async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  // readPath is the path to the file that Claude is trying to read
  const readPath =
    toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || "";

  // Block access to .env files
  if (readPath.endsWith(".env") || readPath.includes(".env.")) {
    console.error("Access denied: reading .env files is not allowed.");
    process.exit(2);
  }
}

main();
