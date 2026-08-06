/* ========================================================
   ARTICLE ENGAGEMENT SYSTEM (LIKES, SHARES, COMMENTS & SUPABASE)
   ======================================================== */

(function () {
    // Ensure css/research.css is loaded for styling across all pages
    if (!document.querySelector('link[href*="css/research.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/research.css';
        document.head.appendChild(link);
    }

    // Default Supabase Configuration
    const SUPABASE_URL = window.SUPABASE_URL || 'https://frgzcwsqbakawyrqegxj.supabase.co';
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZ3pjd3NxYmFrYXd5cnFlZ3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5OTY4MjgsImV4cCI6MjEwMTU3MjgyOH0.gx7BkqFV604F-KclMAgaJ_c-s7Re9FFnlZoGs1PAVSI';

    let supabaseClient = null;

    function getArticleId() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'home';
    }

    function initSupabase() {
        if (window.supabase && SUPABASE_URL.indexOf('YOUR_SUPABASE') === -1) {
            try {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            } catch (e) {
                console.warn('Supabase initialization failed, falling back to local storage:', e);
            }
        }
    }

    function loadSupabaseSDK(callback) {
        if (window.supabase) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
        script.onload = () => {
            initSupabase();
            callback();
        };
        script.onerror = () => {
            callback();
        };
        document.head.appendChild(script);
    }

    // --- DATA FETCH & MUTATION HELPERS ---
    async function fetchLikes(articleId) {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('article_likes')
                    .select('like_count')
                    .eq('article_id', articleId)
                    .single();
                if (data && !error) return data.like_count;
            } catch (e) {}
        }
        const localLikes = localStorage.getItem(`likes_${articleId}`);
        return localLikes ? parseInt(localLikes, 10) : 0;
    }

    async function addLike(articleId) {
        let newCount = 0;
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient.rpc('increment_like', { target_article_id: articleId });
                if (!error && data !== null) {
                    newCount = data;
                }
            } catch (e) {}
        }

        if (!newCount) {
            const current = parseInt(localStorage.getItem(`likes_${articleId}`) || '0', 10);
            newCount = current + 1;
            localStorage.setItem(`likes_${articleId}`, newCount);
        }

        localStorage.setItem(`liked_${articleId}`, 'true');
        return newCount;
    }

    async function fetchComments(articleId) {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('article_comments')
                    .select('*')
                    .eq('article_id', articleId)
                    .order('created_at', { ascending: false });
                if (data && !error) return data;
            } catch (e) {}
        }
        const localComments = localStorage.getItem(`comments_${articleId}`);
        return localComments ? JSON.parse(localComments) : [];
    }

    async function postComment(articleId, name, content) {
        const newComment = {
            id: 'local_' + Date.now(),
            article_id: articleId,
            author_name: name,
            content: content,
            created_at: new Date().toISOString()
        };

        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('article_comments')
                    .insert([{ article_id: articleId, author_name: name, content: content }])
                    .select();
                if (data && data.length > 0 && !error) {
                    return data[0];
                }
            } catch (e) {}
        }

        const existing = JSON.parse(localStorage.getItem(`comments_${articleId}`) || '[]');
        existing.unshift(newComment);
        localStorage.setItem(`comments_${articleId}`, JSON.stringify(existing));
        return newComment;
    }

    function timeAgo(dateString) {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // --- TOP ARTICLE ENGAGEMENT BAR ---
    function renderTopArticleEngagement() {
        const byline = document.querySelector('.byline');
        if (!byline) return;

        const articleId = getArticleId();
        const topBar = document.createElement('div');
        topBar.className = 'top-engagement-bar';
        topBar.innerHTML = `
            <button id="top-like-btn" class="top-engagement-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span id="top-like-count">0</span>
            </button>
            
            <a href="#engagement-section" class="top-engagement-stat" style="text-decoration: none;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span id="top-comment-count">0</span> Comments
            </a>

            <button id="top-share-btn" class="top-engagement-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
            </button>
            <span id="top-share-toast" class="top-share-toast">Copied!</span>
        `;

        byline.appendChild(topBar);

        const topLikeBtn = document.getElementById('top-like-btn');
        const topLikeCount = document.getElementById('top-like-count');
        const topCommentCount = document.getElementById('top-comment-count');
        const topShareBtn = document.getElementById('top-share-btn');
        const topShareToast = document.getElementById('top-share-toast');

        if (localStorage.getItem(`liked_${articleId}`) === 'true') {
            topLikeBtn.classList.add('liked');
        }

        fetchLikes(articleId).then(count => {
            topLikeCount.textContent = count;
        });

        fetchComments(articleId).then(comments => {
            topCommentCount.textContent = comments.length;
        });

        topLikeBtn.addEventListener('click', async () => {
            topLikeBtn.disabled = true;
            const newCount = await addLike(articleId);
            topLikeCount.textContent = newCount;
            topLikeBtn.classList.add('liked');
            const mainLikeLabel = document.getElementById('like-count-label');
            if (mainLikeLabel) mainLikeLabel.textContent = newCount;
        });

        topShareBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                topShareToast.classList.add('show');
                setTimeout(() => topShareToast.classList.remove('show'), 2000);
            });
        });
    }

    // --- WRITINGS PAGE CARD STATS ---
    function renderWritingsPageStats() {
        const statContainers = document.querySelectorAll('.card-engagement-stats');
        statContainers.forEach(async (container) => {
            const articleId = container.getAttribute('data-article-id');
            if (!articleId) return;

            const [likes, comments] = await Promise.all([
                fetchLikes(articleId),
                fetchComments(articleId)
            ]);

            container.innerHTML = `
                <span class="stat-badge" title="Likes">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    ${likes} Likes
                </span>
                <span class="stat-badge" title="Comments">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    ${comments.length} Comments
                </span>
            `;
        });
    }

    // --- MAIN ENGAGEMENT UI INJECTION ---
    function renderEngagementUI() {
        const articleId = getArticleId();
        const container = document.getElementById('engagement-section');
        if (!container) return;

        container.innerHTML = `
            <div class="engagement-wrapper">
                <!-- Action Bar -->
                <div class="engagement-action-bar">
                    <button id="like-btn" class="engagement-btn like-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span id="like-count-label">...</span> Likes
                    </button>

                    <button id="share-btn" class="engagement-btn share-btn">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Share
                    </button>

                    <button id="copy-link-btn" class="engagement-btn secondary-btn">
                        Copy Link
                    </button>
                    <span id="share-toast" class="share-toast">Link copied!</span>
                </div>

                <!-- Comments Section -->
                <div class="comments-container">
                    <h3 class="comments-title">Discussion & Comments</h3>
                    
                    <form id="comment-form" class="comment-form">
                        <div class="form-group">
                            <input type="text" id="comment-name" placeholder="Your Name or Handle" required class="comment-input" />
                        </div>
                        <div class="form-group">
                            <textarea id="comment-content" placeholder="Share your thoughts or questions..." required rows="3" class="comment-textarea"></textarea>
                        </div>
                        <button type="submit" id="submit-comment-btn" class="comment-submit-btn">Post Comment</button>
                    </form>

                    <div id="comments-list" class="comments-list">
                        <div class="comments-loading">Loading comments...</div>
                    </div>
                </div>
            </div>
        `;

        const likeBtn = document.getElementById('like-btn');
        const likeCountLabel = document.getElementById('like-count-label');
        const shareBtn = document.getElementById('share-btn');
        const copyLinkBtn = document.getElementById('copy-link-btn');
        const shareToast = document.getElementById('share-toast');
        const commentForm = document.getElementById('comment-form');
        const commentName = document.getElementById('comment-name');
        const commentContent = document.getElementById('comment-content');
        const commentsList = document.getElementById('comments-list');

        if (localStorage.getItem(`liked_${articleId}`) === 'true') {
            likeBtn.classList.add('liked');
        }

        fetchLikes(articleId).then(count => {
            likeCountLabel.textContent = count;
        });

        likeBtn.addEventListener('click', async () => {
            likeBtn.disabled = true;
            likeBtn.classList.add('pop');
            const newCount = await addLike(articleId);
            likeCountLabel.textContent = newCount;
            likeBtn.classList.add('liked');

            const topLikeCount = document.getElementById('top-like-count');
            if (topLikeCount) topLikeCount.textContent = newCount;

            setTimeout(() => likeBtn.classList.remove('pop'), 300);
        });

        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).catch(() => {});
            } else {
                copyToClipboard();
            }
        });

        copyLinkBtn.addEventListener('click', copyToClipboard);

        function copyToClipboard() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                shareToast.classList.add('show');
                setTimeout(() => shareToast.classList.remove('show'), 2500);
            });
        }

        async function loadComments() {
            const comments = await fetchComments(articleId);
            const topCommentCount = document.getElementById('top-comment-count');
            if (topCommentCount) topCommentCount.textContent = comments ? comments.length : 0;

            if (!comments || comments.length === 0) {
                commentsList.innerHTML = `<div class="no-comments">No comments yet. Be the first to share a thought!</div>`;
                return;
            }

            commentsList.innerHTML = comments.map(c => `
                <div class="comment-card">
                    <div class="comment-header">
                        <span class="comment-author">${escapeHTML(c.author_name)}</span>
                        <span class="comment-date">${timeAgo(c.created_at)}</span>
                    </div>
                    <div class="comment-body">${escapeHTML(c.content)}</div>
                </div>
            `).join('');
        }

        loadComments();

        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = commentName.value.trim();
            const content = commentContent.value.trim();
            if (!name || !content) return;

            const submitBtn = document.getElementById('submit-comment-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Posting...';

            await postComment(articleId, name, content);

            commentContent.value = '';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Comment';

            loadComments();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadSupabaseSDK(() => {
            renderTopArticleEngagement();
            renderEngagementUI();
            renderWritingsPageStats();
        });
    });
})();
