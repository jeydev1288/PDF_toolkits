import packageMetadata from "@/package.json";

export const SITE_NAME = "PDF Toolkit";
export const APP_VERSION = packageMetadata.version;
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "jey.dev1288@gmail.com";
export const WINDOWS_INSTALLER_URL =
  process.env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL?.trim() || null;

export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 50 * 1024 * 1024;

export function formatMegabytes(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}
