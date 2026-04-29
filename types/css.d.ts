declare module "*.css" {
  const styles: Record<string, string>;
  export default styles;
}

/**
 * CSS Custom Properties (Design Tokens)
 * Okorocha Dashboard — globals.css
 */
declare namespace CSSVariables {
  // ─── Surface & Background ───────────────────────────────────────
  type Background     = "var(--background)";
  type Foreground     = "var(--foreground)";
  type Surface        = "var(--surface)";
  type SurfaceStrong  = "var(--surface-strong)";
  type BorderSoft     = "var(--border-soft)";

  // ─── Brand ──────────────────────────────────────────────────────
  type Brand          = "var(--brand)";
  type BrandStrong    = "var(--brand-strong)";
  type BrandSoft      = "var(--brand-soft)";

  // ─── Typography ─────────────────────────────────────────────────
  type Muted          = "var(--muted)";

  // ─── Body Gradient ──────────────────────────────────────────────
  type BodyGrad1      = "var(--body-grad-1)";
  type BodyGrad2      = "var(--body-grad-2)";
  type BodyGrad3      = "var(--body-grad-3)";

  // ─── Shimmer ────────────────────────────────────────────────────
  type ShimmerFrom    = "var(--shimmer-from)";
  type ShimmerMid     = "var(--shimmer-mid)";

  // ─── Inputs ─────────────────────────────────────────────────────
  type InputBg        = "var(--input-bg)";

  // ─── Buttons ────────────────────────────────────────────────────
  type BtnSecondaryBg      = "var(--btn-secondary-bg)";
  type BtnSecondaryBgHover = "var(--btn-secondary-bg-hover)";

  // ─── Badges & Breadcrumbs ───────────────────────────────────────
  type BadgeBg        = "var(--badge-bg)";
  type BreadcrumbBg   = "var(--breadcrumb-bg)";
  type BreadcrumbColor = "var(--breadcrumb-color)";

  // ─── Union of all tokens ────────────────────────────────────────
  type Token =
    | Background
    | Foreground
    | Surface
    | SurfaceStrong
    | BorderSoft
    | Brand
    | BrandStrong
    | BrandSoft
    | Muted
    | BodyGrad1
    | BodyGrad2
    | BodyGrad3
    | ShimmerFrom
    | ShimmerMid
    | InputBg
    | BtnSecondaryBg
    | BtnSecondaryBgHover
    | BadgeBg
    | BreadcrumbBg
    | BreadcrumbColor;
}

/**
 * All CSS custom property names as a union — useful for
 * typed style objects: `{ [key in CSSCustomProperty]?: string }`
 */
type CSSCustomProperty =
  | "--background"
  | "--foreground"
  | "--surface"
  | "--surface-strong"
  | "--border-soft"
  | "--brand"
  | "--brand-strong"
  | "--brand-soft"
  | "--muted"
  | "--body-grad-1"
  | "--body-grad-2"
  | "--body-grad-3"
  | "--shimmer-from"
  | "--shimmer-mid"
  | "--input-bg"
  | "--btn-secondary-bg"
  | "--btn-secondary-bg-hover"
  | "--badge-bg"
  | "--breadcrumb-bg"
  | "--breadcrumb-color";

/**
 * Utility type — use when passing CSS var strings to inline styles
 * or styled-component helpers.
 *
 * @example
 * const color: CSSVar = "var(--brand)";
 */
type CSSVar = CSSVariables.Token;

/**
 * Typed helper for inline style objects that reference design tokens.
 *
 * @example
 * const styles: ThemedStyles = {
 *   color: "var(--foreground)",
 *   background: "var(--surface)",
 * };
 */
type ThemedStyles = Partial<
  Record<keyof CSSStyleDeclaration, CSSVar | string | number>
>;

/**
 * Extend React's CSSProperties to allow CSS custom properties
 * as keys in inline style objects.
 *
 * @example
 * <div style={{ "--brand": "#0f766e" } as AppCSSProperties} />
 */
interface AppCSSProperties extends React.CSSProperties {
  [key: `--${string}`]: string | number | undefined;
}