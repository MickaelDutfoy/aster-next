export const getAuthErrorCode = (err: unknown): string | null => {
  if (!err || typeof err !== 'object') return null;

  const anyErr = err as any;

  // Auth.js v5 wraps the underlying error into `cause`
  const cause = anyErr.cause;

  // common shapes:
  // cause: { err: Error("INVALID_CREDENTIALS") }
  // cause: Error("INVALID_CREDENTIALS")
  // cause: { cause: Error("...") } (nested)
  const directMsg =
    typeof cause?.message === 'string'
      ? cause.message
      : typeof cause?.err?.message === 'string'
        ? cause.err.message
        : typeof cause?.cause?.message === 'string'
          ? cause.cause.message
          : null;

  return directMsg;
};
