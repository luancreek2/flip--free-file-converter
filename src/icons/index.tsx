import { branding } from "../config/branding";

export const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d={branding.logo.path}
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
