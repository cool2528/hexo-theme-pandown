// 导入模块
import { Search } from './modules/search.js';
import { translations } from './modules/translations.js';

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({
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

// 主题切换
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.warn('主题切换按钮未找到');
        return;
    }
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    const root = document.documentElement;
    
    // 初始化主题
    root.classList.add(`theme-${savedTheme}`);
    themeToggle.checked = savedTheme === 'dark';
    
    // 绑定切换事件
    themeToggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        root.classList.remove('theme-light', 'theme-dark');
        root.classList.add(`theme-${theme}`);
        localStorage.setItem('theme', theme);
        
        // 添加调试日志
        console.log('主题切换:', theme);
    });
}

// 更新语言切换路径逻辑
function updateLanguagePath(path, lang) {
    // 移除当前路径中的语言前缀
    path = path.replace(/^\/[a-z]{2}-[A-Z]{2}\//, '/');
    path = path.replace(/^\/[a-z]{2}\//, '/');
    
    // 如果选择的不是默认语言，添加语言前缀
    if (lang !== 'zh-CN') {
        path = `/${lang}${path}`;
    }
    
    return path;
}

// 保留这个更完整的initLanguage函数
function initLanguage() {
    const languageBtn = document.getElementById('languageBtn');
    const languageMenu = document.getElementById('languageMenu');
    
    if (!languageBtn || !languageMenu) {
        console.warn('语言切换元素未找到');
        return;
    }
    
    // 切换菜单显示
    languageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        languageMenu.style.display = languageMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', () => {
        languageMenu.style.display = 'none';
    });
    
    // 语言切换处理
    languageMenu.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A') {
            e.preventDefault();
            const lang = target.dataset.lang;
            const currentPath = window.location.pathname;
            const newPath = updateLanguagePath(currentPath, lang);
            localStorage.setItem('lang', lang);
            window.location.href = newPath;
        }
    });
}

// 只保留一个初始化入口
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 初始化搜索
        const search = new Search();
        
        // 初始化主题和语言
        initTheme();
        initLanguage();
        
        // 添加页面加载动画
        document.body.classList.add('loaded');
        
        // 响应式处理
        handleResize();
    } catch (error) {
        console.error('初始化失败:', error);
    }
});

// 建议将所有功能模块化，使用 ES6 模块系统
export class Navigation {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScroll();
        this.setupResponsiveMenu();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// 语言切换
function initLanguageDropdown() {
    const languageBtn = document.getElementById('languageBtn');
    const languageMenu = document.getElementById('languageMenu');
    
    // 切换菜单显示
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageMenu.classList.toggle('active');
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', () => {
        languageMenu.classList.remove('active');
    });
    
    // 语言切换处理
    languageMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            const currentPath = window.location.pathname;
            
            let newPath = currentPath.replace(/^\/[a-z]{2}-[A-Z]{2}\//, '/');
            newPath = newPath.replace(/^\/[a-z]{2}\//, '/');
            
            if (lang !== 'zh-CN') {
                newPath = `/${lang}${newPath}`;
            }
            
            localStorage.setItem('lang', lang);
            window.location.href = newPath;
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initLanguageDropdown();
}); 