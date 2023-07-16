import browser from 'webextension-polyfill';
import { hide_popup, show_popup } from "./popup";


const ATTR_MARKER = 'kek_gottem';

const get_info = msg => {
    return browser.runtime.sendMessage(msg);
}

async function update() {
    for (const el of document.querySelectorAll(`a:not([${ATTR_MARKER}])`)) {
        const match = /github.com\/([\w_\.-]+)\/([\w\._-]+)/.exec(el.href);
        if (match) {
            const [, user, repo] = match;
            el.setAttribute(ATTR_MARKER, 'found');
            try {
                let cancel_id;
                el.addEventListener('mouseover', async () => {
                    clearTimeout(cancel_id);
                    cancel_id = null;
                    show_popup({
                        loading: true,
                        el,
                    });
                    const repo_info = await get_info({ user, repo });
                    show_popup({
                        repo_info,
                        el,
                    });
                });
                el.addEventListener('mouseout', () => {
                    clearTimeout(cancel_id);
                    cancel_id = setTimeout(() => hide_popup({ el }), 2000);
                });
                el.setAttribute(ATTR_MARKER, 'done');
            } catch (e) {
                console.error(`err`, e);
                el.setAttribute(ATTR_MARKER, 'errored');
            }
        } else {
            el.setAttribute(ATTR_MARKER, 'skipped');
        }
    }
}

document.addEventListener("DOMContentLoaded", update);
setTimeout(update, 1000);

setInterval(update, 5000);
