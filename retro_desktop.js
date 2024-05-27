let windows_list = []

function spawn_window(title, content) {
    const window_elt = document.createElement('div');
    window_elt.className = "window resizable";
    window_elt.innerHTML = '<div class="title-bar"><div class="title-bar-text"></div><div class="title-bar-controls"><button aria-label="Maximize"></button><button aria-label="Close"></button></div></div><div class="window-body"></div>';
    window_elt.getElementsByClassName('title-bar-text')[0].innerText = title;
    const window_body = window_elt.getElementsByClassName('window-body')[0];
    window_body.appendChild(content);
    window_elt.style.position = 'absolute';
    window_elt.style.top = '200px';
    window_elt.style.left = '200px';
    windows_list.push(window_elt);
    window_elt.style.zIndex = windows_list.length + 10;

    const desktop_elt = document.getElementsByClassName('desktop-contents')[0];
    desktop_elt.appendChild(window_elt);
    
    const title_bar = window_elt.getElementsByClassName('title-bar')[0];
    const title_bar_controls = window_elt.getElementsByClassName('title-bar-controls')[0];
    const title_btns = title_bar_controls.getElementsByTagName('button')
    const max_btn = title_btns[0];
    const close_btn = title_btns[1];

    const iframe = window_elt.getElementsByTagName('iframe')[0];

    close_btn.addEventListener('click', (e) => { desktop_elt.removeChild(window_elt) });
    max_btn.addEventListener('click', (e) => {
        if (iframe) {
            window.open(iframe.src, null);
        }
    });

    let drag_active = false;
    let resize_active = false;
    let off_x = 0;
    let off_y = 0;
    let x = 200;
    let y = 200;

    window_elt.addEventListener('click', (e) => {
        for (let i = 0; i < windows_list.length; i++) {
            windows_list[i].style.zIndex--;
        }
        window_elt.style.zIndex = windows_list.length + 10;
    });
    window_elt.addEventListener('mousedown', (e) => {
        const bounds = window_elt.getBoundingClientRect();
        const dist_from_bottom = bounds.height - e.offsetY;
        const dist_from_right = bounds.width - e.offsetX;

        if (dist_from_bottom <= 10 && dist_from_right <= 10) {
            resize_active = true;
        }
    });
    title_bar.addEventListener('mousedown', (e) =>  {
        drag_active = true;
        off_x = e.offsetX;
        off_y = e.offsetY;
        window_elt.style.zIndex = windows_list.length + 10;
    });
    window.addEventListener('mouseup', (e) => {
        drag_active = false;
        resize_active = false;
    });
    window.addEventListener('mousemove', (e) => {
        if (drag_active) {
            x = e.pageX - off_x;
            y = e.pageY - off_y;

            window_elt.style.top = `${y}px`;
            window_elt.style.left = `${x}px`;
        } else if (resize_active) {
            const window_borders_padding = 22;
            const window_title_height = 20;
            const width = e.pageX - x - window_borders_padding;
            const height = e.pageY - y - window_borders_padding - window_title_height;

            if (iframe) {
                iframe.height = `${height}px`;
                iframe.width = `${width}px`;
            } else {
                window_elt.style.height = `${height}px`;
                window_elt.style.width = `${width}px`;
            }
        }
    });
}

function add_fishies_shortcut_listener() {
    fish_shortcut.addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.height = '500px';
        iframe.width = '900px';
        iframe.src = 'idle/index.html';
        iframe.name = `fishies-${Math.floor(Math.random() * 10000)}`
        spawn_window("fishin' for  fishies", iframe);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    add_fishies_shortcut_listener();
});
