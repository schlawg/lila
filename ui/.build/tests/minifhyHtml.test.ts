import { expect, test } from "vitest";
import { minifyHtml } from "../src/parse";

test("minifyHtml", () => {
    const html = `
        <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <h1>Test</h1>
        </body>
        </html>
    `;
    const minified = minifyHtml(html);
    expect(minified).toBe("<html><head><title>Test</title></head><body><h1>Test</h1></body></html>");
});
