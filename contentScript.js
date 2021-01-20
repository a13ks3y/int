localStorage.runingState = 'isOn';
const DATA_TARGET_ATTR_NAME = 'data-old-target-value';
const AFFECTED_LINK_CLASS_NAME = 'int-ext-link';

function makeAllLinksTargetBlank() {
    const links = Array.from(document.getElementsByTagName('a'));
    links.forEach(link => {
        if(!link.classList.contains(AFFECTED_LINK_CLASS_NAME)) {
            // preserve old target for future use (???)
            const oldTarget = link.getAttribute('target');
            link.setAttribute(DATA_TARGET_ATTR_NAME, oldTarget || '');
            link.setAttribute('target', '_blank');
            link.classList.add(AFFECTED_LINK_CLASS_NAME);
        }
    });
}
function revertAllLinksTargetBlank() {
    const links = Array.from(document.getElementsByTagName('a'));
    links.forEach(link => {
        if(link.classList.contains(AFFECTED_LINK_CLASS_NAME)) {
            const oldTarget = link.getAttribute(DATA_TARGET_ATTR_NAME);
            link.setAttribute('target', oldTarget);
            link.classList.remove(AFFECTED_LINK_CLASS_NAME);
        }
    });

}
function main() {
    if (localStorage.runingState === 'isOn') {
        makeAllLinksTargetBlank();
    } else {
        revertAllLinksTargetBlank();
    }
}
function mutationCallback() {
    main();
}
main();
const mutationObserver = new MutationObserver(mutationCallback);
mutationObserver.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener(function (msg) {
    if (msg === 'toggleIntExt') {
        localStorage.runingState = localStorage.runingState === 'isOn' ? 'isOff' : 'isOn';
        main();
    }
});

