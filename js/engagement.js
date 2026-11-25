/* Shared, anonymous likes and moderated comments for individual writeups. */
(function () {
    const SUPABASE_URL = window.SUPABASE_URL || 'https://frgzcwsqbakawyrqegxj.supabase.co';
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZ3pjd3NxYmFrYXd5cnFlZ3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTY4MjgsImV4cCI6MjEwMTU3MjgyOH0.gx7BkqFV604F-KclMAgaJ_c-s7Re9FFnlZoGs1PAVSI';
    const VISITOR_ID_KEY = 'portfolio_anonymous_visitor_id';
    const COMMENT_MAX_LENGTH = 2000;
    const NAME_MAX_LENGTH = 50;

    let supabaseClient = null;
    let supabaseClientPromise = null;

    function getArticleId() {
        const engagement = document.getElementById('engagement-section');
        if (engagement?.dataset.articleId) return engagement.dataset.articleId;

        const path = window.location.pathname.replace(/\/+$/, '');
        const slug = path.split('/').pop().replace(/\.html$/i, '');
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
            throw new Error('This writeup is missing a valid article identifier.');
        }
        return slug;
    }

    function createVisitorId() {
        if (!window.crypto?.getRandomValues) {
            throw new Error('This browser cannot create a secure anonymous visitor ID.');
        }

        if (window.crypto.randomUUID) return window.crypto.randomUUID();
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    function getVisitorId() {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId || '')) {
            visitorId = createVisitorId();
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }
        return visitorId;
    }

    function loadSupabaseSDK() {
        if (window.supabase?.createClient) return Promise.resolve();
        if (supabaseClientPromise) return supabaseClientPromise;

        supabaseClientPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
            script.onload = () => window.supabase?.createClient
                ? resolve()
                : reject(new Error('The Supabase client library loaded without its API.'));
            script.onerror = () => reject(new Error('The Supabase client library could not be loaded.'));
            document.head.appendChild(script);
        }).catch((error) => {
            supabaseClientPromise = null;
            throw error;
        });
        return supabaseClientPromise;
    }

    async function getSupabaseClient() {
        if (supabaseClient) return supabaseClient;
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            throw new Error('The public Supabase URL or anonymous key is missing.');
        }

        await loadSupabaseSDK();
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
        });
        return supabaseClient;
    }

    function unwrapRpcRow(data) {
        const row = Array.isArray(data) ? data[0] : data;
        if (!row) throw new Error('The engagement service returned an empty response.');
        return row;
    }

    async function getArticleEngagement(articleId, visitorId) {
        const client = await getSupabaseClient();
        const { data, error } = await client.rpc('get_article_engagement', {
            target_article_id: articleId,
            target_visitor_id: visitorId
        });
        if (error) throw error;
        const row = unwrapRpcRow(data);
        return {
            likeCount: Number(row.like_count),
            visitorLiked: row.visitor_liked === true,
            commentCount: Number(row.comment_count)
        };
    }

    async function toggleArticleLike(articleId, visitorId) {
        const client = await getSupabaseClient();
        const { data, error } = await client.rpc('toggle_article_like', {
            target_article_id: articleId,
            target_visitor_id: visitorId
        });
        if (error) throw error;
        const row = unwrapRpcRow(data);
        return { likeCount: Number(row.like_count), visitorLiked: row.liked === true };
    }

    async function fetchApprovedComments(articleId) {
        const client = await getSupabaseClient();
        const { data, error } = await client
            .from('article_comments')
            .select('id, article_id, author_name, content, created_at')
            .eq('article_id', articleId)
            .eq('moderation_status', 'approved')
            .order('created_at', { ascending: true });
        if (error) throw error;
        return Array.isArray(data) ? data : [];
    }

    async function submitComment(articleId, visitorId, authorName, content, honeypot) {
        const client = await getSupabaseClient();
        const { data, error } = await client.rpc('submit_article_comment', {
            target_article_id: articleId,
            target_visitor_id: visitorId,
            target_author_name: authorName,
            target_content: content,
            target_honeypot: honeypot
        });
        if (error) throw error;
        return unwrapRpcRow(data);
    }

    function setStatus(element, message, isError = false) {
        if (!element) return;
        element.textContent = message;
        element.classList.toggle('error', isError);
    }

    function setLikeButtons(state) {
        document.querySelectorAll('[data-like-button]').forEach((button) => {
            button.classList.toggle('liked', state.visitorLiked);
            button.setAttribute('aria-pressed', String(state.visitorLiked));
            button.disabled = false;
            const count = button.querySelector('[data-like-count]');
            if (count) count.textContent = String(state.likeCount);
            const label = button.querySelector('[data-like-label]');
            if (label) label.textContent = state.visitorLiked ? 'Liked' : 'Like';
        });

    }

    function setCommentCount(count) {
        document.querySelectorAll('[data-comment-count]').forEach((element) => {
            element.textContent = String(count);
        });
    }

    function formatCommentDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'Date unavailable';
        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        }).format(date);
    }

    function renderComments(container, comments) {
        container.replaceChildren();
        if (!comments.length) {
            const empty = document.createElement('div');
            empty.className = 'no-comments';
            empty.textContent = 'No approved comments yet. Be the first to share a thought.';
            container.appendChild(empty);
            return;
        }

        comments.forEach((comment) => {
            const card = document.createElement('article');
            card.className = 'comment-card';

            const header = document.createElement('div');
            header.className = 'comment-header';
            const author = document.createElement('span');
            author.className = 'comment-author';
            author.textContent = comment.author_name;
            const date = document.createElement('time');
            date.className = 'comment-date';
            date.dateTime = comment.created_at;
            date.textContent = formatCommentDate(comment.created_at);
            header.append(author, date);

            const body = document.createElement('p');
            body.className = 'comment-body';
            body.textContent = comment.content;
            card.append(header, body);
            container.appendChild(card);
        });
    }

    function renderTopEngagement(articleId) {
        const byline = document.querySelector('.byline, .essay-byline');
        if (!byline || byline.dataset.engagementBar === 'true') return;

        const bar = document.createElement('div');
        bar.className = 'top-engagement-bar';
        bar.dataset.engagementBar = 'true';
        bar.innerHTML = `
            <button type="button" class="top-engagement-btn" data-like-button data-article-id="${articleId}" aria-pressed="false" disabled>
                <span data-like-label>Like</span><span data-like-count>—</span>
            </button>
            <a class="top-engagement-stat" href="#engagement-section"><span data-comment-count>—</span> Comments</a>
            <button type="button" class="top-engagement-btn" data-share-button>Share</button>
            <span class="top-share-toast" data-share-status role="status" aria-live="polite"></span>
        `;
        byline.insertAdjacentElement('afterend', bar);
    }

    function renderEngagementUI(articleId) {
        const container = document.getElementById('engagement-section');
        if (!container || container.dataset.engagementRendered === 'true') return;
        container.dataset.engagementRendered = 'true';
        container.dataset.articleId = articleId;
        container.innerHTML = `
            <div class="engagement-wrapper">
                <div class="engagement-action-bar">
                    <button type="button" class="engagement-btn like-btn" data-like-button data-article-id="${articleId}" aria-pressed="false" disabled>
                        <span data-like-label>Like</span><span data-like-count>—</span>
                    </button>
                    <button type="button" class="engagement-btn secondary-btn" data-share-button>Share</button>
                    <span class="share-toast" data-share-status role="status" aria-live="polite"></span>
                </div>
                <p class="like-sync-status" data-like-status role="status" aria-live="polite">Loading likes…</p>
                <section class="comments-container" aria-labelledby="comments-title-${articleId}">
                    <h3 class="comments-title" id="comments-title-${articleId}">Discussion &amp; Comments</h3>
                    <form class="comment-form" data-comment-form novalidate>
                        <div class="form-group">
                            <label class="engagement-field-label" for="comment-name-${articleId}">Display name</label>
                            <input type="text" id="comment-name-${articleId}" name="author_name" placeholder="Your name or handle" required maxlength="${NAME_MAX_LENGTH}" autocomplete="name" class="comment-input">
                        </div>
                        <div class="form-group">
                            <label class="engagement-field-label" for="comment-content-${articleId}">Comment</label>
                            <textarea id="comment-content-${articleId}" name="content" placeholder="Share your thoughts or questions…" required maxlength="${COMMENT_MAX_LENGTH}" rows="4" class="comment-textarea"></textarea>
                        </div>
                        <div class="engagement-honeypot" aria-hidden="true">
                            <label for="website-${articleId}">Leave this field empty</label>
                            <input id="website-${articleId}" name="website" type="text" tabindex="-1" autocomplete="off">
                        </div>
                        <button type="submit" class="comment-submit-btn" data-comment-submit>Post comment</button>
                        <p class="comment-status" data-comment-status role="status" aria-live="polite"></p>
                    </form>
                    <div class="comments-list" data-comments-list aria-live="polite">
                        <div class="comments-loading">Loading approved comments…</div>
                    </div>
                </section>
            </div>
        `;
    }

    async function refreshArticle(articleId, visitorId) {
        const status = document.querySelector('[data-like-status]');
        try {
            const state = await getArticleEngagement(articleId, visitorId);
            if (!Number.isFinite(state.likeCount) || !Number.isFinite(state.commentCount)) {
                throw new Error('The engagement service returned invalid counts.');
            }
            setLikeButtons(state);
            setCommentCount(state.commentCount);
            setStatus(status, '');
        } catch (error) {
            console.error(`Could not load engagement for ${articleId}:`, error);
            document.querySelectorAll('[data-like-button]').forEach((button) => { button.disabled = false; });
            setStatus(status, 'Likes could not be loaded. Please try again.', true);
        }

        const list = document.querySelector('[data-comments-list]');
        if (!list) return;
        try {
            const comments = await fetchApprovedComments(articleId);
            renderComments(list, comments);
        } catch (error) {
            console.error(`Could not load approved comments for ${articleId}:`, error);
            list.replaceChildren();
            const message = document.createElement('div');
            message.className = 'comments-error';
            message.textContent = 'Comments could not be loaded. Please try again later.';
            list.appendChild(message);
        }
    }

    function commentErrorMessage(error) {
        const errorText = `${error?.message || ''} ${error?.details || ''}`;
        if (errorText.includes('COMMENT_RATE_LIMITED')) {
            return 'You’ve reached the comment limit. Please try again later.';
        }
        if (errorText.includes('COMMENT_SPAM_REJECTED')) {
            return 'Your comment could not be accepted. Please review it and try again.';
        }
        if (errorText.includes('INVALID_COMMENT')) {
            return `Check the display name and keep your comment within ${COMMENT_MAX_LENGTH} characters.`;
        }
        return 'Your comment could not be submitted. Please try again.';
    }

    function bindArticleInteractions(articleId, visitorId) {
        document.querySelectorAll('[data-like-button]').forEach((button) => {
            button.addEventListener('click', async () => {
                if (button.disabled) return;
                const status = document.querySelector('[data-like-status]');
                document.querySelectorAll('[data-like-button]').forEach((item) => { item.disabled = true; });
                setStatus(status, 'Saving your like…');
                try {
                    const state = await toggleArticleLike(articleId, visitorId);
                    setLikeButtons(state);
                    setStatus(status, '');
                } catch (error) {
                    console.error(`Could not toggle like for ${articleId}:`, error);
                    document.querySelectorAll('[data-like-button]').forEach((item) => { item.disabled = false; });
                    setStatus(status, 'Your like could not be saved. Please try again.', true);
                }
            });
        });

        document.querySelectorAll('[data-share-button]').forEach((button) => {
            button.addEventListener('click', async () => {
                const status = button.parentElement.querySelector('[data-share-status]');
                try {
                    if (navigator.share) await navigator.share({ title: document.title, url: location.href });
                    else {
                        await navigator.clipboard.writeText(location.href);
                        setStatus(status, 'Link copied.');
                        window.setTimeout(() => setStatus(status, ''), 1800);
                    }
                } catch (error) {
                    if (error?.name !== 'AbortError') {
                        console.error('Could not share this writeup:', error);
                        setStatus(status, 'Sharing is unavailable in this browser.', true);
                    }
                }
            });
        });

        const form = document.querySelector('[data-comment-form]');
        if (!form) return;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nameInput = form.elements.author_name;
            const contentInput = form.elements.content;
            const honeypot = form.elements.website;
            const status = form.querySelector('[data-comment-status]');
            const submitButton = form.querySelector('[data-comment-submit]');
            const authorName = nameInput.value.trim();
            const content = contentInput.value.trim();

            if (!authorName || authorName.length > NAME_MAX_LENGTH) {
                setStatus(status, `Add a display name of ${NAME_MAX_LENGTH} characters or fewer.`, true);
                nameInput.focus();
                return;
            }
            if (!content || content.length > COMMENT_MAX_LENGTH) {
                setStatus(status, `Write a comment of ${COMMENT_MAX_LENGTH} characters or fewer.`, true);
                contentInput.focus();
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Posting…';
            setStatus(status, 'Submitting your comment…');
            try {
                const result = await submitComment(articleId, visitorId, authorName, content, honeypot.value);
                form.reset();
                setStatus(status, result.moderation_status === 'pending'
                    ? 'Thanks. Your comment is awaiting moderation.'
                    : 'Your comment was submitted.');
                const updated = await getArticleEngagement(articleId, visitorId);
                setCommentCount(updated.commentCount);
            } catch (error) {
                console.error(`Could not submit comment for ${articleId}:`, error);
                setStatus(status, commentErrorMessage(error), true);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Post comment';
            }
        });
    }

    async function renderWritingsPageStats() {
        const containers = document.querySelectorAll('.card-engagement-stats[data-article-id]');
        if (!containers.length) return;
        let visitorId;
        try {
            visitorId = getVisitorId();
        } catch (error) {
            console.error('Could not create an anonymous visitor ID:', error);
            containers.forEach((container) => { container.textContent = 'Engagement counts unavailable'; });
            return;
        }

        for (const container of containers) {
            const articleId = container.dataset.articleId;
            try {
                const state = await getArticleEngagement(articleId, visitorId);
                container.replaceChildren();
                for (const [label, count] of [['Likes', state.likeCount], ['Comments', state.commentCount]]) {
                    const badge = document.createElement('span');
                    badge.className = 'stat-badge';
                    badge.textContent = `${count} ${label}`;
                    container.appendChild(badge);
                }
            } catch (error) {
                console.error(`Could not load writing-card stats for ${articleId}:`, error);
                container.textContent = 'Engagement counts could not be loaded';
            }
        }
    }

    async function initializeArticle() {
        const engagement = document.getElementById('engagement-section');
        if (!engagement) return;

        let articleId;
        let visitorId;
        try {
            articleId = getArticleId();
            visitorId = getVisitorId();
        } catch (error) {
            console.error('Could not initialize article engagement:', error);
            engagement.textContent = 'Likes and comments need a secure browser session to load.';
            return;
        }

        renderTopEngagement(articleId);
        renderEngagementUI(articleId);
        bindArticleInteractions(articleId, visitorId);
        await Promise.all([refreshArticle(articleId, visitorId), renderWritingsPageStats()]);
        window.setInterval(() => {
            if (!document.hidden) refreshArticle(articleId, visitorId);
        }, 30000);
        window.addEventListener('focus', () => refreshArticle(articleId, visitorId));
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) refreshArticle(articleId, visitorId);
        });
    }

    function start() {
        if (document.getElementById('engagement-section')) initializeArticle();
        else renderWritingsPageStats();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();

    document.addEventListener('portfolio:tab-content-updated', renderWritingsPageStats);
})();
