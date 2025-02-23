// CDN 容错处理
class CDNFallback {
    constructor(resources) {
        this.resources = resources; // CDN资源数组
        this.currentIndex = 0;
    }

    loadCSS(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            link.onload = () => resolve(url);
            link.onerror = () => reject(url);

            document.head.appendChild(link);
        });
    }

    async tryLoadResource() {
        while (this.currentIndex < this.resources.length) {
            try {
                const url = this.resources[this.currentIndex];
                await this.loadCSS(url);
                console.log(`成功加载CDN: ${url}`);
                return true;
            } catch (error) {
                console.warn(`CDN加载失败: ${error}, 尝试下一个...`);
                this.currentIndex++;
            }
        }
        console.error('所有CDN均加载失败');
        return false;
    }
}

// 配置CDN资源
const cdnResources = [
    'https://cdn.staticfile.org/remixicon/3.5.0/remixicon.css',
    'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
];

// 初始化并执行
const cdnFallback = new CDNFallback(cdnResources);
cdnFallback.tryLoadResource(); 