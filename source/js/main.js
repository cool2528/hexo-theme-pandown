// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 响应式导航菜单
const toggleMenu = () => {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
};

// 移动端菜单切换
const toggleSidebar = () => {
  document.body.classList.toggle('sidebar-open');
};

// 设置面板控制
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.querySelector('.settings-panel');
const closeSettings = document.querySelector('.close-settings');

settingsBtn.addEventListener('click', () => {
  settingsPanel.classList.add('active');
});

closeSettings.addEventListener('click', () => {
  settingsPanel.classList.remove('active');
});

// 点击面板外关闭设置
document.addEventListener('click', (e) => {
  if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
    settingsPanel.classList.remove('active');
  }
});

// 语言切换
const languageSelect = document.querySelector('.language-select');
if (languageSelect) {
  languageSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    // 实现语言切换逻辑
    window.location.href = `/${lang}${window.location.pathname}`;
  });
}

// 搜索功能
const searchBox = document.querySelector('.search-box input');
if (searchBox) {
  searchBox.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    // 实现搜索逻辑
  });
}

// 响应式处理
const handleResize = () => {
  if (window.innerWidth <= 768) {
    document.body.classList.remove('sidebar-open');
  }
};

window.addEventListener('resize', handleResize);

// 页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// 搜索功能
class Search {
    constructor() {
        this.searchBox = document.querySelector('.search-box input');
        this.searchResults = document.querySelector('.search-results');
        this.searchData = null;
        this.bindEvents();
    }

    bindEvents() {
        if (!this.searchBox) return;

        this.searchBox.addEventListener('input', this.debounce(() => {
            this.performSearch(this.searchBox.value);
        }, 300));

        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!this.searchBox.contains(e.target) && !this.searchResults?.contains(e.target)) {
                this.searchResults?.classList.remove('active');
            }
        });
    }

    async performSearch(query) {
        if (!query) {
            this.searchResults?.classList.remove('active');
            return;
        }

        if (!this.searchData) {
            try {
                const response = await fetch('/search.json');
                this.searchData = await response.json();
            } catch (error) {
                console.error('Failed to load search data:', error);
                return;
            }
        }

        const results = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        this.renderResults(results);
    }

    renderResults(results) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-result-item">无搜索结果</div>';
        } else {
            this.searchResults.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <a href="${result.url}">
                        <div class="result-title">${result.title}</div>
                        <div class="result-preview">${this.truncate(result.content, 100)}</div>
                    </a>
                </div>
            `).join('');
        }

        this.searchResults.classList.add('active');
    }

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 设置面板
class SettingsPanel {
    constructor() {
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.querySelector('.settings-panel');
        this.closeBtn = document.querySelector('.close-settings');
        this.languageSelect = document.querySelector('.language-select');
        this.bindEvents();
    }

    bindEvents() {
        if (!this.settingsBtn || !this.settingsPanel) return;

        this.settingsBtn.addEventListener('click', () => {
            this.settingsPanel.classList.add('active');
        });

        this.closeBtn?.addEventListener('click', () => {
            this.settingsPanel.classList.remove('active');
        });

        this.languageSelect?.addEventListener('change', (e) => {
            const lang = e.target.value;
            window.location.href = `/${lang}${window.location.pathname}`;
        });

        // 点击外部关闭设置面板
        document.addEventListener('click', (e) => {
            if (!this.settingsPanel.contains(e.target) && !this.settingsBtn.contains(e.target)) {
                this.settingsPanel.classList.remove('active');
            }
        });
    }
}

// 初始化
new Search();
new SettingsPanel(); 