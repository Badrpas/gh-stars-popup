import { hide_popup, show_popup } from "./popup";


const TOKEN = "<TOKEN_HERE>";
const ATTR_MARKER = 'kek_gottem';

const HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": "Bearer " + TOKEN,
    "X-GitHub-Api-Version": "2022-11-28",
};


async function update () {
    for (const el of document.querySelectorAll(`a:not([${ATTR_MARKER}])`)) {
        const match = /\/\/github.com\/([\w_-]+)\/([\w_-]+)/.exec(el.href);
        if (match) {
            const [, user, repo] = match;
            el.setAttribute(ATTR_MARKER, 'found');
            try {
                const resp = await fetch({
                    url: `https://api.github.com/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}`,
                    headers: HEADERS,
                });
                if (resp.ok) {
                    const repo_info = await resp.json();
                    console.log('repo_info', repo_info);

                    el.addEventListener('mouseover', () => {
                        show_popup({
                            repo_info,
                            el,
                        });
                    });
                    el.addEventListener('mouseout', () => hide_popup({ el }));
                    el.setAttribute(ATTR_MARKER, 'done');
                }
            } catch(e) {
                console.error(`err`, e);
                el.setAttribute(ATTR_MARKER, 'errored');
            }
        } else {
            el.setAttribute(ATTR_MARKER, 'skipped');
        }
    }
}

update();

setInterval(update, 5_000);
