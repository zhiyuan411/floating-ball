# 悬浮球组件 (Floating Ball)

一个轻量级、可定制的悬浮球组件，点击后可以展开多个功能菜单项，适用于快速导航、返回顶部等功能。

## 功能特点

- **可定制的位置**：支持四个角落（右下、左下、右上、左上）
- **扇形菜单动画**：菜单项以扇形分布展开，带有平滑过渡效果
- **完全可定制**：自定义按钮样式、菜单半径、动画时长等
- **图标支持**：支持自定义配置 [Font Awesome](https://fontawesome.com/icons) 图标
- **无依赖**：纯原生 JavaScript 实现
- **插件系统**：支持集成百度统计、自定义页脚等功能
- **资源自动加载**：可自动加载Font Awesome图标和组件样式
- **URL参数控制**：支持通过URL参数隐藏悬浮球

## 安装方法
### 本地部署准备步骤
1. 在网站根目录下创建 `floating-ball` 文件夹，在该文件夹内执行 `git clone https://github.com/zhiyuan411/floating-ball.git` 克隆仓库。（或者手动将 `floating-ball.js`、`floating-ball.css` 和 `load-floating-ball.js` 三个文件下载到该文件夹下）
2. 若存在二级域名根目录，可在其目录下执行 `ln -s /path/to/floating-ball ./` 命令，创建到网站根目录 `floating-ball` 文件夹的软链接（因悬浮球的js、css文件的寻址方式是使用相对于域名的绝对地址）。

### 文件结构
```
floating-ball/
├── floating-ball.js         # 主逻辑文件
├── floating-ball.css        # 样式文件
└── load-floating-ball.js    # 加载脚本
```

### 直接引入

在HTML文件中引入以下资源：

```html
<!-- 引入加载器（会自动处理依赖） -->
<script src="/floating-ball/load-floating-ball.js" ></script>

<!-- 或者手动引入核心文件（需自行处理依赖） -->
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zhiyuan411/floating-ball@main/floating-ball.css"> -->
<!-- <script src="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css"></script> -->
<!-- <script src="https://cdn.jsdelivr.net/gh/zhiyuan411/floating-ball@main/floating-ball.js"></script> -->
<!-- <script>window.FloatingBall.create({})</script> -->
```


## 快速开始

### 基本用法
引入加载器后，组件会自动初始化并使用默认配置。最简单的集成方式是在目标HTML文件的`<body>`标签末尾（`</body>`前）添加以下代码：

```html
<script src="/floating-ball/load-floating-ball.js" ></script>
```

刷新页面后（静态页面可能需在开发者模式中清除缓存），即可在页面右下角看到悬浮球，点击可展开扇形菜单。

### 通过全局配置对象自定义
你也可以通过全局配置对象`floatingBallConfig`自定义参数：

```html
<script>
  window.floatingBallConfig = {
    position: 'bottom-left',          // 悬浮球位置调整为左下角
    radius: 80,                       // 菜单展开半径设为80px
    main_button: {
      icon: 'fa-comment',             // 主按钮图标改为评论图标
      backgroundColor: '#FF5E5E'      // 主按钮背景色改为红色
    },
    menu_items: [
      { icon: 'fa-home', text: '首页', href: '/' },
      { icon: 'fa-envelope', text: '联系我们', href: '/contact' }
    ]
  };
</script>
```

### 脚本标签配置（data-属性方式）
通过`data-`属性在加载器脚本标签中传递配置：

```html
<script src="load-floating-ball.js"
        data-auto-init="true"               // 启用自动初始化
        data-position="top-right"           // 悬浮球位置调整为右上角
        data-radius="70"                    // 菜单半径设为70px
        data-main-button-icon="fa-question" // 主按钮图标改为问号
        data-menu-items='[{"icon":"fa-star","text":"收藏","href":"#favorite"},{"icon":"fa-share","text":"分享","href":"#share"}]'></script>
```

### 高级配置实例
#### 禁用Font Awesome自动加载
当目标页面已加载Font Awesome或需使用其他图标库时：

```html
<script src="/floating-ball/load-floating-ball.js" data-load_font_awesome="false" ></script>
<!-- 需手动引入Font Awesome或其他图标库 -->
<script src="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css"></script>
```

#### 调整菜单展开半径
将点击悬浮球后的展开扇形菜单半径设置为50px：

```html
<script src="/floating-ball/load-floating-ball.js" data-radius="50" ></script>
```

#### 自定义主按钮背景图片
使用网站图标作为主按钮背景：

```html
<script>
window.floatingBallConfig = {
  main_button: {
    backgroundImage: '/favicon.png', // 替换为实际图标路径
    imageSize: 'cover'
  }
};
</script>
```

### 使用实例

[阿里云服务器网站悬浮球](https://blog.csdn.net/zhiyuan411/article/details/148357547)

## 配置选项

### 核心组件配置（`floating-ball.js`）

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `position` | string | `bottom-right` | 悬浮球位置，可选值：`bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `spacing` | number | 30 | 菜单项间距角度（度） |
| `radius` | number | 90 | 菜单项离主按钮的半径距离（像素） |
| `main_button` | object | 见下方 | 主按钮配置对象 |
| `menu_items` | array | 见示例 | 菜单项数组，每个项包含图标、文本、链接等 |
| `animation.duration` | number | 300 | 动画持续时间（毫秒） |
| `animation.easing` | string | `ease` | 动画缓动函数 |
| `plugins` | array | `[createBaiduAnalyticsPlugin('默认ID'), createFooterPlugin()]` | 插件数组，可包含百度统计和页脚插件等各种自定义插件 |

#### `main_button` 详细配置

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `icon` | string | `fa-plus` | Font Awesome图标类名 |
| `backgroundColor` | string | `#165DFF` | 背景颜色（当使用背景图片时无效） |
| `textColor` | string | `#FFFFFF` | 文本颜色（当使用背景图片时无效） |
| `backgroundImage` | string | `/favicon.png` | 背景图片URL，设置后会覆盖背景色 |
| `imageSize` | string | `cover` | 背景图片大小，可选值：`cover`, `contain`, `auto` |

### 加载器配置（`load-floating-ball.js`）

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `load_font_awesome` | boolean | `true` | 是否自动加载Font Awesome图标 |
| `load_styles` | boolean | `true` | 是否自动加载组件样式 |
| `load_core` | boolean | `true` | 是否自动加载核心脚本 |
| `auto_init` | boolean | `true` | 是否自动初始化组件 |
| `core_script_path` | string | `/floating-ball/floating-ball.js` | 核心脚本路径 |
| `style_path` | string | `/floating-ball/floating-ball.css` | 样式文件路径 |
| `init_timeout` | number | 5000 | 初始化超时时间（毫秒） |

## 插件系统

### 百度统计插件工厂使用示例
```javascript
// 创建百度统计插件实例（需替换为你的统计ID）
const baiduPlugin = FloatingBall.createBaiduAnalyticsPlugin('64882ae3fa9d52d8502dad44af4833a6');

// 在配置中使用
window.floatingBallConfig = {
  plugins: [baiduPlugin]
};
```

### 页脚插件工厂使用示例
```javascript
// 创建自定义页脚插件实例
const footerPlugin = FloatingBall.createFooterPlugin({
  spacing: '2rem',            // 页脚与内容间距
  className: 'custom-footer', // 自定义类名
  content: '<div class="footer-container"><p class="footer-text">© 2025 我的网站 - 版权所有</p></div>' // 自定义内容
});

// 在配置中使用
window.floatingBallConfig = {
  plugins: [footerPlugin]
};
```

### 自定义插件
```javascript
// 自定义插件示例（实际是插件工厂，返回的函数才是插件实体）
function createLogPlugin() {
  return function(instance) {
    instance.on('menuOpen', () => console.log('菜单已打开'));
    instance.on('menuClose', () => console.log('菜单已关闭'));
    instance.on('itemClick', (item) => console.log(`点击菜单项: ${item.text}`));
  };
}

// 在配置中使用
window.floatingBallConfig = {
  plugins: [createLogPlugin()]
};
```

## API参考

### `FloatingBall.create(config)`
创建并初始化悬浮球实例，返回包含以下方法的实例对象：
- `openMenu()`: 打开菜单
- `closeMenu()`: 关闭菜单
- `destroy()`: 销毁组件
- `getConfig()`: 获取当前配置

### `FloatingBall.createBaiduAnalyticsPlugin(trackingId)`
创建百度统计插件，参数为百度统计ID。

### `FloatingBall.createFooterPlugin(options)`
创建页脚插件，可选参数：
- `spacing`: 页脚与内容间距（默认4rem）
- `className`: 页脚容器类名（默认default-footer）
- `content`: 页脚HTML内容（默认显示版权信息）

## 高级用法

### 手动控制初始化时机
通过`window.FloatingBallLoader` API可精确控制悬浮球的初始化时机：

```html
<!-- 先引入加载器并关闭自动初始化 -->
<script src="/floating-ball/load-floating-ball.js" data-auto-init="false"></script>

<script>
// 等待页面加载完成后手动初始化
document.addEventListener('DOMContentLoaded', function() {
  const customConfig = {
    position: 'top-left',
    main_button: {
      icon: 'fa-bars',
      backgroundColor: '#333'
    },
    menu_items: [
      { 
        icon: 'fa-user', 
        text: '个人中心', 
        href: '/user',
        onClick: function(e) {
          e.preventDefault();
          console.log('点击了个人中心');
        }
      }
    ]
  };
  
  // 通过FloatingBallLoader手动加载
  window.FloatingBallLoader.load(customConfig);
  
  // 延迟打开菜单示例
  setTimeout(() => {
    const instance = FloatingBall.instances[0];
    if (instance) instance.openMenu();
  }, 2000);
});
</script>
```

### 通过全局配置对象覆盖默认参数
在目标页面的JS中设置`window.floatingBallConfig`对象，可覆盖悬浮球插件的默认配置：

```html
<!-- 引入加载器 -->
<script src="/floating-ball/load-floating-ball.js"></script>

<!-- 覆盖插件配置（示例：仅保留百度统计插件，移除页脚插件） -->
<script>
window.floatingBallConfig = {
  plugins: [window.FloatingBallLoader.createBaiduAnalyticsPlugin('64882ae3fa9d52d8502dad44af4833a6')]
};
</script>
```

### 自定义菜单项点击事件
```html
<script>
window.floatingBallConfig = {
  menu_items: [
    {
      icon: 'fa-arrow-up',
      text: '回到顶部',
      href: '#',
      onClick: function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        const instance = FloatingBall.instances[0];
        if (instance) instance.closeMenu();
      }
    },
    {
      icon: 'fa-external-link',
      text: '外部链接',
      href: 'https://example.com',
      onClick: function(e) {
        e.preventDefault();
        window.open(this.href, '_blank');
        const instance = FloatingBall.instances[0];
        if (instance) instance.closeMenu();
      }
    }
  ]
};
</script>
```

## 样式定制

### 定位类扩展
通过CSS类名可以自定义悬浮球位置间距：
- `.floating-ball-bottom-6`: 底部间距24px（默认值）
- `.floating-ball-right-6`: 右侧间距24px（默认值）
- `.floating-ball-left-6`: 左侧间距24px
- `.floating-ball-top-6`: 顶部间距24px
- 可通过修改类名中的数字调整间距（如`.floating-ball-bottom-10`表示底部间距40px）

### 自定义动画效果
如需修改动画效果，可覆盖以下CSS类：

```css
/* 主按钮图标旋转动画（点击时展开菜单的图标变换） */
.floating-ball-rotate-icon {
  transform: rotate(135deg);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 自定义缓动函数 */
}

/* 菜单项显示动画（淡入效果） */
.floating-ball-item {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, pointer-events 0.3s ease;
}
.floating-ball-item.opacity-100 {
  opacity: 1;
  pointer-events: auto;
}

/* 自定义菜单展开轨迹（示例：更平缓的扇形展开） */
.floating-ball-item {
  transform-origin: 100% 100%; /* 调整旋转原点 */
}
```

## 常见问题

### 如何隐藏悬浮球？
1. **URL参数方式**：在URL中添加`?floating-ball=0`，如`https://example.com/page?floating-ball=0`
2. **JavaScript控制**：
```javascript
// 隐藏悬浮球
const container = document.getElementById('floating-ball-container');
if (container) container.style.display = 'none';

// 显示悬浮球
if (container) container.style.display = 'block';
```

### 菜单点击后不关闭怎么办？
菜单项默认点击后会自动关闭菜单，若自定义`onClick`事件需手动关闭菜单：
```javascript
onClick: function(e) {
  e.preventDefault();
  // 自定义逻辑...
  const instance = FloatingBall.instances[0];
  if (instance) instance.closeMenu();
}
```

### 如何替换默认图标库？

1. 将`load_font_awesome`设为`false`：
```html
<script src="/floating-ball/load-floating-ball.js" data-load_font_awesome="false"></script>
```
2. 引入其他图标库（如Font Awesome 6或Material Icons）：
```html
<script src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/js/all.min.js"></script>
```
3. 在配置中使用新图标类名：
```javascript
window.floatingBallConfig = {
  main_button: {
    icon: 'fas fa-comment' // Font Awesome 6的图标类名
  },
  menu_items: [
    { icon: 'fas fa-home', text: '首页', href: '/' }
  ]
};
```

### 静态页面缓存导致更新不生效？
由于静态页面缓存策略，刷新可能无法立即看到更新效果，可通过以下方式解决：
1. 在浏览器开发者工具中强制刷新（Ctrl+Shift+R或Cmd+Shift+R）
2. 在加载脚本时添加版本参数：
```html
<script src="/floating-ball/load-floating-ball.js?v=20250615" ></script>
```

## 浏览器兼容性

支持所有现代浏览器（Chrome, Firefox, Safari, Edge）。IE浏览器不支持。

## 项目结构
- `floating-ball.js`: 核心组件实现，包含悬浮球创建、配置、事件处理
- `floating-ball.css`: 组件样式，定义悬浮球外观和动画
- `load-floating-ball.js`: 加载器脚本，负责资源管理和自动初始化
- `README.md`: 项目文档和使用指南

## 贡献指南
1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交Pull Request

## 许可证
MIT License © 2025 zhiyuan411

## 联系方式
如果你有任何问题或者建议，可以通过以下方式联系我：
- GitHub: [zhiyuan411](https://github.com/zhiyuan411)
- Email: <zhiyuan411@gmail.com>
