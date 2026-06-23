export const LOGO_FONT_OPTIONS = [
  {
    label: "Sukunsh Italic Wordmark",
    value: "\"Sukunsh Wordmark\", \"Clash Display Local\", \"Arial Black\", Impact, sans-serif",
  },
  {
    label: "Francois One",
    value: "\"Francois One Local\", \"Arial Narrow\", Impact, sans-serif",
  },
  {
    label: "AXIS",
    value: "\"AXIS Local\", \"Arial Narrow\", Impact, sans-serif",
  },
  {
    label: "Baveuse",
    value: "\"Baveuse Local\", \"Arial Narrow\", Impact, sans-serif",
  },
  {
    label: "Baveuse 3D",
    value: "\"Baveuse 3D Local\", \"Arial Narrow\", Impact, sans-serif",
  },
  {
    label: "HIDROM",
    value: "\"HIDROM Local\", \"Arial Narrow\", Impact, sans-serif",
  },
];

export const DEFAULT_LOGO_FONT = LOGO_FONT_OPTIONS[0].value;

export const getLogoFontStyle = (fontFamily?: string) => {
  const selected = fontFamily || DEFAULT_LOGO_FONT;
  const base = {
    fontFamily: selected,
    fontKerning: "normal",
    fontFeatureSettings: "\"kern\" 1, \"liga\" 1, \"calt\" 1",
    textRendering: "geometricPrecision",
  };

  if (selected.includes("Sukunsh Wordmark")) {
    return {
      ...base,
      fontWeight: 700,
      fontStyle: "italic",
      letterSpacing: "-0.052em",
      textTransform: "none",
      transform: "skewX(-4deg)",
    };
  }

  if (selected.includes("AXIS")) {
    return { ...base, letterSpacing: "-0.018em" };
  }

  if (selected.includes("Baveuse 3D")) {
    return { ...base, letterSpacing: "0.005em" };
  }

  if (selected.includes("Baveuse")) {
    return { ...base, letterSpacing: "-0.006em" };
  }

  if (selected.includes("HIDROM")) {
    return { ...base, letterSpacing: "-0.024em" };
  }

  return { ...base, letterSpacing: "-0.012em" };
};
