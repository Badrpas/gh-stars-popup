import browser from 'webextension-polyfill';


const TOKEN = "<TOKEN_HERE>";

const HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": "Bearer " + TOKEN,
    "X-GitHub-Api-Version": "2022-11-28",
};


const storage = {};
// browser.storage.local.clear()
browser.storage.local.get()
    .then(data => {
        Object.assign(storage, (data));
        console.log(`storage`, storage)
    });
console.log(browser.storage);
const save_storage = () => {
    return browser.storage.local.set(storage);
};

const TIMEOUT = 1000 * 60 * 60 * 24;
// const TIMEOUT = 1000 * 20;
const to_date = date => {
    return +date;
};

const get_info = async ({ user, repo }) => {
    if (storage[user]?.[repo]) {
        const repo_info = storage[user][repo];
        if (!repo_info.updated_at || (Date.now() - to_date(repo_info.updated_at) > TIMEOUT)) {
            console.log(`reupdating info on ${user}/${repo}`);
        } else {
            // console.log(`reusing`, Date.now() - to_date(repo_info.updated_at));
            return repo_info;
        }
    }

    const resp = await fetch(
        `https://api.github.com/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}`,
        {
            headers: HEADERS,
        }
    );
    if (resp.ok) {
        const repo_info = await resp.json();
        console.log('repo_info', repo_info);
        if (!storage[user]) storage[user] = {};
        storage[user][repo] = repo_info;
        repo_info.updated_at = Date.now();
        await save_storage();
        return repo_info;
    }
};

const SelfID = browser.runtime.id;

browser.runtime.onMessage.addListener(async (msg, sender) => {
    if (sender.id !== SelfID) return;
    try {
        return await get_info(msg);
    } catch (e) {
        console.error(`err while handling req:`, e);
        throw e;
    }
});
