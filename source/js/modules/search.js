export class Search {
    constructor() {
        this.searchBox = document.querySelector('.search-box input');
        this.searchResults = document.querySelector('.search-results');
        this.searchLoading = document.querySelector('.search-loading');
        this.searchData = null;
        this.isLoading = false;
        this.hasError = false;
        
        if (this.searchBox) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.searchBox.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!this.searchBox.contains(e.target)) {
                this.hideResults();
            }
        });
    }

    async handleSearch(query) {
        if (!query) {
            this.hideResults();
            return;
        }

        try {
            this.showLoading();
            
            if (!this.searchData) {
                const response = await fetch('/search.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.searchData = await response.json();
            }
            
            const results = this.searchData
                .filter(item => this.matchSearchCriteria(item, query))
                .slice(0, 5);
                
            this.showResults(results);
        } catch (error) {
            console.error('搜索出错:', error);
            this.showError('搜索失败，请稍后重试');
        } finally {
            this.hideLoading();
        }
    }

    matchSearchCriteria(item, query) {
        const searchTerm = query.toLowerCase();
        return (
            (item.title && item.title.toLowerCase().includes(searchTerm)) ||
            (item.content && item.content.toLowerCase().includes(searchTerm))
        );
    }

    showResults(results) {
        if (!this.searchResults) return;
        
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="no-results">没有找到相关结果</div>';
        } else {
            this.searchResults.innerHTML = results
                .map(item => `
                    <div class="search-result-item">
                        <a href="${item.url || '#'}">
                            <h4>${item.title || '无标题'}</h4>
                            <p>${item.content ? item.content.slice(0, 100) + '...' : '无内容'}</p>
                        </a>
                    </div>
                `).join('');
        }
        
        this.searchResults.classList.add('active');
    }

    hideResults() {
        if (this.searchResults) {
            this.searchResults.classList.remove('active');
        }
    }

    showLoading() {
        if (this.searchLoading) {
            this.searchLoading.style.display = 'block';
        }
        this.isLoading = true;
    }

    hideLoading() {
        if (this.searchLoading) {
            this.searchLoading.style.display = 'none';
        }
        this.isLoading = false;
    }

    showError(message) {
        console.error(message);
        // 可以添加错误提示UI
        if (this.searchResults) {
            this.searchResults.innerHTML = `
                <div class="search-error">
                    <i class="ri-error-warning-line"></i>
                    <span>${message}</span>
                </div>
            `;
            this.searchResults.classList.add('active');
        }
    }
} 