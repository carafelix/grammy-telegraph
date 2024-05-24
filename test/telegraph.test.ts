import { assertExists } from "https://deno.land/std@0.203.0/assert/assert_exists.ts";
import { parseMarkdown, Telegraph } from "../src/deps.deno.ts";
import { TelegraphOpts } from "../src/types.d.ts";
import { assertObjectMatch } from "./deps.test.ts";
import { describe, it } from "./deps.test.ts";
import { dummyMarkdownText } from "./assets/text.ts";

function getPublisher(publisher?: TelegraphOpts): TelegraphOpts {
    return { short_name: "Anonymous", ...publisher };
}

describe("Publisher opts tests", () => {
    it("Should assign a publisher short name if no opts", () => {
        let publisher = undefined;
        publisher = getPublisher(publisher);
        assertObjectMatch(publisher, { short_name: "Anonymous" });
    });
    it("If publisher.author_name exist, should keep it", () => {
        let publisher = { short_name: "Papito" };
        publisher = getPublisher(publisher);
        assertObjectMatch(publisher, { short_name: "Papito" });
    });
});

describe("Publish", () => {
    it("Creating an article should work with no access token provided", async () => {
        const publisher = getPublisher({ short_name: "papito" });
        const tph = new Telegraph(publisher);
        if (!tph.token.length) {
            tph.token = (await tph.createAccount(publisher)).access_token;
        }
        const longMessage = dummyMarkdownText;
        const content = parseMarkdown(longMessage);

        assertExists(content);

        const page = await tph
            .create({
                title: `any`,
                content,
                ...publisher,
            });

        assertExists(page.url);
    });
});
