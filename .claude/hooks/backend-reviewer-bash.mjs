let raw = '';

for await (const chunk of process.stdin) raw += chunk;

let command = '';

try {
  const input = JSON.parse(raw);
  command = (input.tool_input?.command ?? '').trim();
} catch (error) {
  console.error('Invalid JSON input');
  process.exit(2);
}

const hasShellOperators = /[;&|`$<>()\n\r]/.test(command);

const allowed = [
  /^git (diff|log|show)(\s|$)/,
  /^pnpm test:(unit|e2e):api(\s|$)/,
];

if (
  /--output/.test(command) ||
  !command ||
  hasShellOperators ||
  !allowed.some((pattern) => pattern.test(command))
) {
  console.error(`Command not allowed for this agent: ${command}`);
  process.exit(2);
}

process.exit(0);
