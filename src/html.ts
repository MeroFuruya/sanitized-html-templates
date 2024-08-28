import sanitizeHtml from "sanitize-html";
import { HtmlTemplate } from "./template.interface";

function isHtmlTemplate(value: unknown): value is HtmlTemplate {
  return (
    value != null &&
    typeof value === "object" &&
    "@type" in value &&
    "getHtml" in value &&
    (value as { "@type": string })["@type"] === "HtmlTemplate" &&
    typeof (value as HtmlTemplate).getHtml === "function"
  );
}

function sanitizeValue(value: unknown) {
  return sanitizeHtml(String(value), {
    allowedTags: [],
    allowedAttributes: {},
  });
}

function parseValue(value: unknown): string {
  if (value == null) {
    return "";
  }
  if (isHtmlTemplate(value)) {
    return value.getHtml();
  }
  if (Array.isArray(value) && value.every(isHtmlTemplate)) {
    return value.map((v) => v.getHtml()).join("\n");
  }
  return sanitizeValue(value);
}

export const html = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): HtmlTemplate =>
  ({
    "@type": "HtmlTemplate",
    getHtml: () =>
      strings.reduce((result, string, i) => {
        const value = values[i] === undefined ? "" : values[i];
        return `${result}${string}${parseValue(value)}`;
      }),
  } as HtmlTemplate);
