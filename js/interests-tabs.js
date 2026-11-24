(() => {
  const tabs = document.querySelector("[data-tab-navigation], .interest-subnav");
  const content = document.querySelector("[data-tab-content], #interest-content");
  if (!tabs || !content) return;

  const links = Array.from(tabs.querySelectorAll("a[href]"));
  const allowedPaths = new Set(links.map((link) => new URL(link.href, location.href).pathname));
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const pageCache = new Map([
    [location.pathname, {
      html: content.innerHTML,
      title: document.title,
      description: descriptionMeta?.content || ""
    }]
  ]);
  let navigationToken = 0;

  function updateActiveTab(pathname) {
    links.forEach((link) => {
      const active = new URL(link.href, location.href).pathname === pathname;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  async function showPage(url, addHistoryEntry) {
    if (url.origin !== location.origin || !allowedPaths.has(url.pathname)) return;
    const token = ++navigationToken;
    content.setAttribute("aria-busy", "true");

    try {
      let page = pageCache.get(url.pathname);
      if (!page) {
        const response = await fetch(url.href);
        if (!response.ok) throw new Error(`Could not load ${url.pathname}`);
        const documentCopy = new DOMParser().parseFromString(await response.text(), "text/html");
        const incomingContent = documentCopy.querySelector("[data-tab-content], #interest-content");
        if (!incomingContent) throw new Error("The destination page has no tab content section");
        page = {
          html: incomingContent.innerHTML,
          title: documentCopy.title,
          description: documentCopy.querySelector('meta[name="description"]')?.content || ""
        };
        pageCache.set(url.pathname, page);
      }

      if (token !== navigationToken) return;
      content.classList.add("is-switching");
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (token !== navigationToken) return;

      content.innerHTML = page.html;
      content.setAttribute("aria-busy", "false");
      content.classList.remove("is-switching");
      document.title = page.title;
      if (descriptionMeta && page.description) descriptionMeta.content = page.description;
      updateActiveTab(url.pathname);
      content.dispatchEvent(new CustomEvent("portfolio:tab-content-updated", { bubbles: true }));

      if (addHistoryEntry) {
        history.pushState({ sectionPath: url.pathname }, "", `${url.pathname}${url.search}${url.hash}`);
      }
    } catch (error) {
      if (token !== navigationToken) return;
      content.setAttribute("aria-busy", "false");
      if (addHistoryEntry) location.assign(url.href);
      else location.reload();
    }
  }

  tabs.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || !tabs.contains(link) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !allowedPaths.has(url.pathname)) return;
    event.preventDefault();
    if (url.pathname !== location.pathname) showPage(url, true);
  });

  window.addEventListener("popstate", () => showPage(new URL(location.href), false));
  updateActiveTab(location.pathname);
})();
