import { ATTR_MARKER } from "./content";

let popup;
export const show_popup = ({ loading, repo_info, el }) => {
    if (!popup) {
        const root = document.createElement('div');
        Object.assign(root.style, {
            'position': 'absolute',
            'background': 'black',
            'z-index': 1000,
            'margin-left': '31px',
        });

        const title = document.createElement('div');
        const descr = document.createElement('div');
        root.append(title);
        root.append(descr);

        popup = {
            root,
            title,
            descr,
        };
    }

    if (loading) {
        popup.title.innerHTML = `Loading...`;
        popup.descr.innerHTML = ``;
    } else if (repo_info) {
        popup.title.innerHTML = `
        [${repo_info.stargazers_count} &#x1F44D;] 
            <a href=${repo_info.owner.html_url} ${ATTR_MARKER}=1>${repo_info.owner.login}</a>
            /
            <a href=${repo_info.html_url} ${ATTR_MARKER}=1>${repo_info.name}</a>`
        if (repo_info.description)
            popup.descr.innerHTML = `${repo_info.description}`;
        else
            popup.descr.innerHTML = ``;
    } else {
        popup.title.innerHTML = `Errored`;
        popup.descr.innerHTML = ``;
    }

    el.append(popup.root);
};

export const hide_popup = ({ el }) => {
    if (!popup) return;
    if (popup.root.parentNode === el) {
        el?.removeChild(popup.root);
    }
}
