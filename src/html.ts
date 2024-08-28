import sanitizeHtml from "sanitize-html";
import { HtmlTemplate } from "./template.interface";

function isHtmlTemplate(value: unknown): value is HtmlTemplate {
  return (
    !!value &&
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

export const html = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): HtmlTemplate =>
  ({
    "@type": "HtmlTemplate",
    getHtml: () =>
      strings.reduce((result, string, i) => {
        const value = values[i] === undefined ? "" : values[i];
        return `${result}${string}${
          isHtmlTemplate(value) ? value.getHtml() : sanitizeValue(value)
        }`;
      }),
  } as HtmlTemplate);
