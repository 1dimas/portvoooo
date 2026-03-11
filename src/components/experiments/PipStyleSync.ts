// Menyalin seluruh style sheet dari document.head utama
// Ke dalam document.head Document Picture-in-Picture

export const copyStylesToPipWindow = (pipWindow: Window) => {
    Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
            if (styleSheet.cssRules) {
                // Inline styles
                const newStyleEl = document.createElement('style');
                Array.from(styleSheet.cssRules).forEach((cssRule) => {
                    newStyleEl.appendChild(document.createTextNode(cssRule.cssText));
                });
                pipWindow.document.head.appendChild(newStyleEl);
            } else if (styleSheet.href) {
                // External linked styles
                const newLinkEl = document.createElement('link');
                newLinkEl.rel = 'stylesheet';
                newLinkEl.href = styleSheet.href;
                pipWindow.document.head.appendChild(newLinkEl);
            }
        } catch (e) {
            // Jika ada masalah CORS saat mengakses cssRules dari origin berbeda
            if (styleSheet.href) {
                const newLinkEl = document.createElement('link');
                newLinkEl.rel = 'stylesheet';
                newLinkEl.href = styleSheet.href;
                pipWindow.document.head.appendChild(newLinkEl);
            }
            console.warn("PipStyleSync error copying stylesheet:", e);
        }
    });

    // Copy explicit <style> tags as well
    const headScripts = document.head.querySelectorAll("style, link[rel='stylesheet']");
    headScripts.forEach(node => {
        pipWindow.document.head.appendChild(node.cloneNode(true));
    });
};
