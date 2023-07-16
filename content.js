import browser from 'webextension-polyfill';
import { hide_popup, show_popup } from "./popup";


export const ATTR_MARKER = 'kek_gottem';

const get_info = msg => {
    return browser.runtime.sendMessage(msg);
}

async function update() {
    for (const el of document.querySelectorAll(`a:not([${ATTR_MARKER}])`)) {
        const match = /(?:\/\/|^)github.com\/([\w_\.-]+)\/([\w\._-]+)\/?$/.exec(el.href);
        if (match) {
            const [, user, repo] = match;
            el.setAttribute(ATTR_MARKER, 'found');
            if (user === 'users') return;
            try {
                let cancel_id;
                el.addEventListener('mouseover', async (e) => {
                    clearTimeout(cancel_id);
                    cancel_id = null;
                    if (e.target !== el) return; // user link child anchor
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
