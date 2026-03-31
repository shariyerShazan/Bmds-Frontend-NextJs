export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_API_URL || "https://bmdsserver.vercel.app/api/v1";
}
