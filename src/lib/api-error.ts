export function getApiErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado',
): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    const message = (error.response.data as { message: string | string[] })
      .message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }
  return fallback;
}
