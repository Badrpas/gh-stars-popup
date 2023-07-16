let popup;
export const show_popup = ({ repo_info, el }) => {
    if (!popup) {
        const root = document.createElement('div');
        Object.assign(popup.style, {
            'position': 'absolute',
        });

        const title = document.createElement('div');
        const descr = document.createElement('div');

        popup = {
            root,
            title,
            descr,
        };
    }

    popup.title.innerHTML = `[${repo_info.stargazers}] <a href=${repo_info.owner.url}>${repo_info.owner.login}</a>/<a href=${repo_info.html_url}>${repo_info.name}</a>`
    popup.descr.innerHTML = `${repo_info.description}`;
    el.append(popup.el);
};

export const hide_popup = ({el}) => {
    if (!popup) return;
    if (popup.el.parentNode === el) {
        el?.removeChild(popup.el);
    }
}
