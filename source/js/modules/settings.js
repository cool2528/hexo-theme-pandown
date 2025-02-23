export default class SettingsPanel {
    constructor() {
        this.elements = {
            settingsBtn: document.getElementById('settingsBtn'),
            panel: document.getElementById('settingsPanel'),
            closeBtn: document.getElementById('closeSettings'),
            languageSelect: document.getElementById('languageSelect'),
            themeSelect: document.getElementById('themeSelect')
        };
        
        this.init();
    }

    init() {
        if (!this.validateElements()) {
            console.warn('必要的设置面板元素未找到');
            return;
        }
        
        this.bindEvents();
        this.initTheme();
    }

    validateElements() {
        return this.elements.settingsBtn && 
               this.elements.panel && 
               this.elements.closeBtn && 
               this.elements.languageSelect && 
               this.elements.themeSelect;
    }

    initTheme() {
        // 获取保存的主题或默认主题
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // 设置下拉框的值
        if(this.elements.themeSelect) {
            this.elements.themeSelect.value = savedTheme;
        }
    }

    setTheme(theme) {
        const root = document.documentElement;
        
        // 移除所有主题相关的类
        root.classList.remove('theme-light', 'theme-dark');
        
        if (theme === 'auto') {
            // 检测系统主题
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(`theme-${prefersDark ? 'dark' : 'light'}`);
            
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                    root.classList.remove('theme-light', 'theme-dark');
                    root.classList.add(`theme-${e.matches ? 'dark' : 'light'}`);
                });
        } else {
            // 直接设置主题
            root.classList.add(`theme-${theme}`);
        }
        
        localStorage.setItem('theme', theme);
    }

    bindEvents() {
        // 打开设置面板
        this.elements.settingsBtn.addEventListener('click', () => {
            this.elements.panel.classList.add('active');
        });

        // 关闭设置面板
        this.elements.closeBtn.addEventListener('click', () => {
            this.elements.panel.classList.remove('active');
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!this.elements.panel.contains(e.target) && 
                !this.elements.settingsBtn.contains(e.target)) {
                this.elements.panel.classList.remove('active');
            }
        });

        // 主题切换
        this.elements.themeSelect.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // 语言切换
        this.bindLanguageChange();
    }

    bindLanguageChange() {
        this.elements.languageSelect.addEventListener('change', (e) => {
            try {
                const lang = e.target.value;
                const currentPath = window.location.pathname;
                
                // 移除当前路径中的语言前缀
                let newPath = currentPath.replace(/^\/[a-z]{2}-[A-Z]{2}\//, '/');
                newPath = newPath.replace(/^\/[a-z]{2}\//, '/');
                
                // 如果选择的不是默认语言,添加语言前缀
                if (lang !== 'zh-CN') {
                    newPath = `/${lang}${newPath}`;
                }
                
                // 保存语言设置
                localStorage.setItem('lang', lang);
                
                // 跳转到新路径
                window.location.href = newPath;
            } catch (error) {
                console.error('语言切换失败:', error);
            }
        });
    }
} 