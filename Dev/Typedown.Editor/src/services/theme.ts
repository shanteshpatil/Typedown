import transport from 'services/transport';
import { remote } from 'services/remote';

transport.addListener('ThemeChanged', onThemeChanged)

remote.getCurrentTheme().then(arg => {
    onThemeChanged(arg);
    setTimeout(() => remote.contentLoaded(), 0);
})

function getorCreateStyle(id: string) {
    let style = document.getElementById(id) as HTMLLinkElement;
    if (!style) {
        style = document.createElement("link");
        style.rel = "stylesheet";
        style.id = id;
        document.head.appendChild(style)
    }
    return style;
}

function getorCreateMeta(id: string) {
    let el = document.getElementById(id) as HTMLStyleElement;
    if (!el) {
        el = document.createElement("style");
        el.id = id;
        document.head.appendChild(el);
    }
    return el;
}

const GOOGLE_FONTS: Record<string, string> = {
    'Mulish': 'Mulish:ital,wght@0,300;0,400;0,600;0,700;1,400',
    'Inter': 'Inter:wght@300;400;500;600;700',
    'Lora': 'Lora:ital,wght@0,400;0,600;0,700;1,400',
    'Merriweather': 'Merriweather:ital,wght@0,300;0,400;0,700;1,400',
    'Source Sans Pro': 'Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400',
    'Crimson Pro': 'Crimson+Pro:ital,wght@0,400;0,600;1,400',
    'IBM Plex Sans': 'IBM+Plex+Sans:ital,wght@0,300;0,400;0,600;1,400',
    'Nunito': 'Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400',
};

const loadedFonts = new Set<string>();

function loadGoogleFont(fontName: string) {
    if (loadedFonts.has(fontName)) return;
    const query = GOOGLE_FONTS[fontName];
    if (!query) return;
    loadedFonts.add(fontName);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
    document.head.appendChild(link);
}

function onThemeChanged({ theme, accentColor, background, editorFont }: any) {
    const editorStyleDocument = getorCreateStyle("link_style_editor");
    const prismjsStyleDocument = getorCreateStyle("link_style_prismjs");
    const codemirrorStyleDocument = getorCreateStyle("link_style_codemirror");

    theme = theme?.toLowerCase()
    editorStyleDocument.href = `theme/editor/${theme}.theme.css`
    prismjsStyleDocument.href = `theme/prismjs/${theme}.theme.css`
    codemirrorStyleDocument.href = `theme/codemirror/${theme}.theme.css`

    const themeColorAlphas = [10, 20, 30, 40, 50, 60, 70, 80, 90]
    const { r, g, b, a } = accentColor
    const { R: bgR, G: bgG, B: bgB, A: bgA } = background

    document.body.style.backgroundColor = `rgba(${bgR}, ${bgG}, ${bgB}, ${bgA})`;
    document.documentElement.style.setProperty('--actualTheme', theme)
    document.documentElement.style.setProperty('--themeColor', `rgba(${r}, ${g}, ${b}, ${a})`)
    themeColorAlphas.forEach(e => document.documentElement.style.setProperty(`--themeColor${e}`, `rgba(${r}, ${g}, ${b}, ${a * (e / 100)})`))

    window.actualTheme = theme

    // Apply editor font
    const font = editorFont || 'Mulish';
    loadGoogleFont(font);
    const fontStyle = getorCreateMeta("style_editor_font");
    fontStyle.textContent = `
        html, body, #ag-editor-id {
            font-family: "${font}", "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
        }
    `;
    document.documentElement.style.setProperty('--editorFont', `"${font}"`);
}
