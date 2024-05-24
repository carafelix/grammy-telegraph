import { endsInWhitespace } from '../src/utils.ts';
import {
    describe,
    it,
    assertEquals,
} from "./deps.test.ts";

describe("Utils", () => {
    it('Should add a whitespace if the accompany msg does not end in one', () => {
        const msg = 'papito'
        const url = 'http://example.com'

        const message = msg
            ? (endsInWhitespace(msg) ? msg : msg + ' ') + url
            : url;

        assertEquals(message, 'papito http://example.com')
    })
    it('Should no add a whitespace if the accompany msg does end in one', () => {
        let msg = 'papito\n'
        const url = 'http://example.com'

        let message = msg
            ? (endsInWhitespace(msg) ? msg : msg + ' ') + url
            : url;

        assertEquals(message, 'papito\nhttp://example.com')

        msg = 'papito\t'
        message = msg
            ? (endsInWhitespace(msg) ? msg : msg + ' ') + url
            : url;

        assertEquals(message, 'papito\thttp://example.com')

        msg = 'papito '
        message = msg
            ? (endsInWhitespace(msg) ? msg : msg + ' ') + url
            : url;

        assertEquals(message, 'papito http://example.com')
    })
})
