/**
 * Extracts a human-readable error message from API / Axios / Zod error responses.
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred. Please try again.',
): string {
  if (!error) return fallback;

  const err = error as any;
  const data = err?.response?.data;

  if (data) {
    // If message is an array (e.g., NestJS ValidationPipe with class-validator)
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message.join(', ');
    }

    // If message is a string
    if (typeof data.message === 'string' && data.message.trim().length > 0) {
      return data.message;
    }

    // If error field is a string
    if (typeof data.error === 'string' && data.error.trim().length > 0) {
      return data.error;
    }

    // If errors array exists (e.g. Zod or custom validation)
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
        .map((e: any) => (typeof e === 'string' ? e : e?.message || JSON.stringify(e)))
        .filter(Boolean)
        .join(', ');
    }
  }

  // Axios network or timeout errors
  if (err?.message) {
    if (err.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return err.message;
  }

  return fallback;
}
