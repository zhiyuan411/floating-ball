/**
 * 悬浮球组件 - 核心实现
 */
(function(window, document) {
  // 定义全局命名空间
  const FloatingBall = window.FloatingBall = {
    instances: []
  };

  // 默认配置（组件核心配置）
  const defaultConfig = {
    position: 'bottom-right',
    spacing: 30, // 菜单项间距角度
    radius: 90, // 菜单项离主按钮的半径距离（像素）
    main_button: {
      icon: 'fa-plus',
      backgroundColor: '#165DFF',
      textColor: '#FFFFFF',
      backgroundImage: '/favicon.png', // 背景图片URL
      imageSize: 'cover'  // 背景图片大小（cover|contain|auto）
    },
    menu_items: [
      {
        icon: 'fa-arrow-up',
        text: '回到顶部',
        href: '#',
        backgroundColor: '#165DFF',
        textColor: '#FFFFFF',
        onClick: function(e) {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          // const button = document.getElementById('floating-ball-button');
          // if (button) {
          //   button.click();
          // }
          const instance = FloatingBall.instances[0];
          if (instance) instance.closeMenu();
        }
      },
      {
        icon: 'fa-home',
        text: '首页',
        href: '/',
        backgroundColor: '#165DFF',
        textColor: '#FFFFFF'
      },
      {
        icon: 'fa-external-link',
        text: '主站',
        href: 'https://cnfaq.cn/',
        backgroundColor: '#165DFF',
        textColor: '#FFFFFF'
      },
      {
        icon: 'fa-times',
        text: '隐藏悬浮球',
        href: '#',
        backgroundColor: '#165DFF',
        textColor: '#FFFFFF',
        onClick: function(e) {
          e.preventDefault();
          const container = document.getElementById('floating-ball-container');
          if (container) {
            container.style.display = 'none';
          }
        }
      }
    ],
    animation: {
      duration: 300,
      easing: 'ease'
    },
    plugins: [
      createBaiduAnalyticsPlugin('64882ae3fa9d52d8502dad44af4833a6'),
      createFooterPlugin()
    ]
  };

  /**
   * 创建百度统计插件
   */
  function createBaiduAnalyticsPlugin(trackingId) {
    return function() {
      if (!trackingId) return;

      if (window._hmt) return;

      window._hmt = window._hmt || [];
      const hm = document.createElement("script");
      hm.src = `https://hm.baidu.com/hm.js?${trackingId}`;
      const s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
      //console.log('baidu build finish');
    };
  };

  /**
   * 创建页脚插件
   */
  function createFooterPlugin(options) {
    options = options || {};

    return function() {

      let footer = document.querySelector('footer');
      if (footer && !options.override) return;

      // 创建页脚样式
      const style = document.createElement('style');
      style.id = 'footer-styles';
      style.textContent = `
        footer {
          background-color: #1f2937;
          color: white;
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
          margin-top: ${options.spacing || '4rem'};
        }
        
        .footer-container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        .footer-text {
          text-align: center;
          font-size: 0.875rem;
        }
      `;
      document.head.appendChild(style);
      

      footer = document.createElement('footer');
      footer.className = options.className || 'default-footer';
      
      // 使用纯 CSS 类
      footer.innerHTML = options.content || `
        <div class="footer-container">
          <p class="footer-text">版权所有 © ${new Date().getFullYear()} cnfaq.cn</p>
        </div>
      `;

      if (document.querySelector('footer')) {
        document.querySelector('footer').replaceWith(footer);
      } else {
        document.body.appendChild(footer);
      }
    };
  }

  // 创建全局样式
  function createGlobalStyles() {
    // 已通过CSS文件导入
  }

  /**
   * 检查URL参数，判断是否应该隐藏悬浮球
   */
  function shouldHideFloatingBall() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('floating-ball') === '0';
  }

  /**
   * 创建悬浮球组件
   */
  function create(config) {
    //console.log("in create, config=", config);

    // 检查URL参数中是否包含floating-ball=0，如果是则不显示悬浮球
    if (shouldHideFloatingBall()) {
      // console.log('URL参数包含floating-ball=0，不显示悬浮球');
      return null;
    }

    // 创建全局样式（如果不存在）
    if (!document.getElementById('floating-ball-styles')) {
      createGlobalStyles();
    }
    
    const mergedConfig = { ...defaultConfig, ...config };
    //console.log("mergedConfig=", mergedConfig);

    // 创建DOM结构
    const container = createContainer(mergedConfig);
    const mainButton = createMainButton(mergedConfig);
    const menuItems = createMenuItems(mergedConfig);

    // 应用样式
    applyStyles(mergedConfig);

    // 外部创建状态对象
    const state = { menuOpen: false };

    // 绑定事件
    bindEvents(mainButton, menuItems, mergedConfig, state);

    // 应用插件
    applyPlugins(mergedConfig);

    // 创建组件实例
    const instance = {
      openMenu: () => {
        openMenu(menuItems, mainButton, mergedConfig);
        state.menuOpen = true;
      },
      closeMenu: () => {
        closeMenu(menuItems, mainButton);
        state.menuOpen = false;
      },
      destroy: () => destroy(container),
      getConfig: () => mergedConfig
    };

    FloatingBall.instances.push(instance);
    return instance;
  };

  /**
   * 创建容器元素
   */
  function createContainer(config) {
    const container = document.createElement('div');
    container.id = 'floating-ball-container';

    // 根据位置设置样式
    switch(config.position) {
      case 'bottom-right':
        container.classList.add('floating-ball-bottom-6', 'floating-ball-right-6');
        break;
      case 'bottom-left':
        container.classList.add('floating-ball-bottom-6', 'floating-ball-left-6');
        break;
      case 'top-right':
        container.classList.add('floating-ball-top-6', 'floating-ball-right-6');
        break;
      case 'top-left':
        container.classList.add('floating-ball-top-6', 'floating-ball-left-6');
        break;
    }

    document.body.appendChild(container);
    return container;
  }

  /**
   * 创建主按钮（支持背景图片）
   */
  function createMainButton(config) {
    const button = document.createElement('button');
    button.id = 'floating-ball-button';

    // 设置通用样式
    button.style.transition = `transform ${config.animation.duration}ms ${config.animation.easing}`;

    // 根据配置设置背景
    if (config.main_button.backgroundImage) {
      // 使用背景图片
      button.style.backgroundImage = `url('${config.main_button.backgroundImage}')`;
      button.style.backgroundSize = config.main_button.imageSize || 'cover';
      button.style.backgroundPosition = 'center';
      button.style.backgroundRepeat = 'no-repeat';

      // 如果使用图片背景，需要设置空图标，即只有占位符
      button.innerHTML = `<i class="fa text-xl"></i>`;
      // 图标颜色透明
      //button.style.color = 'transparent';
    } else {
      // 使用背景色
      button.style.backgroundColor = config.main_button.backgroundColor;
      button.style.color = config.main_button.textColor;
      button.innerHTML = `<i class="fa ${config.main_button.icon} text-xl"></i>`;
    }

    // 添加图标旋转样式
    const icon = button.querySelector('i');
    icon.style.transition = `transform ${config.animation.duration}ms ${config.animation.easing}`;

    document.getElementById('floating-ball-container').appendChild(button);
    return button;
  }

  /**
   * 创建菜单项
   */
  function createMenuItems(config) {
    const container = document.createElement('div');
    container.id = 'floating-ball-items';

    document.getElementById('floating-ball-container').appendChild(container);

    const items = [];

    config.menu_items.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'floating-ball-item';
      menuItem.style.transitionDelay = `${index * 50}ms`;

      menuItem.innerHTML = `
        <a href="${item.href || '#'}" title="${item.text}">
          <span style="background-color: ${item.backgroundColor}; color: ${item.textColor}">
            <i class="fa ${item.icon}"></i>
          </span>
        </a>
      `;

      // 如果定义了onClick函数，则添加点击事件
      const link = menuItem.querySelector('a');
      if (typeof item.onClick === 'function') {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          item.onClick(e);
        });
      }

      container.appendChild(menuItem);
      items.push(menuItem);
    });

    return items;
  }

  /**
   * 应用样式
   */
  function applyStyles(config) {
    // 这里可以添加更多样式应用逻辑
  }

  /**
   * 绑定事件
   */
  function bindEvents(mainButton, menuItems, config, state) {

    // 主按钮点击事件
    mainButton.addEventListener('click', () => {

      if (state.menuOpen) {
        closeMenu(menuItems, mainButton);
      } else {
        openMenu(menuItems, mainButton, config);
      }

      // 反转状态
      state.menuOpen = !state.menuOpen;
    });

    // 点击其他区域关闭菜单
    document.addEventListener('click', (e) => {
      const container = document.getElementById('floating-ball-container');
      if (!container.contains(e.target) && state.menuOpen) {
        closeMenu(menuItems, mainButton);
        state.menuOpen = false;
      }
    });
  }

  /**
   * 打开菜单
   */
  function openMenu(menuItems, mainButton, config) {
    // 旋转主按钮图标
    mainButton.querySelector('i').classList.add('floating-ball-rotate-icon');

    // 显示菜单项
    menuItems.forEach((item, index) => {
      // 计算菜单项位置（扇形分布）
      const angle = (index * config.spacing) * (Math.PI / 180);
      let x = Math.cos(angle) * config.radius;
      let y = Math.sin(angle) * config.radius;

      // 根据位置调整角度计算方式
      if (config.position.includes('right')) {
        x = -x;
      }

      if (config.position.includes('bottom')) {
        y = -y;
      }

      // 设置菜单项位置和样式
      setTimeout(() => {
        item.style.transform = `translate(${x}px, ${y}px)`;
        item.classList.add('opacity-100');
      }, index * 50);
    });
  }

  /**
   * 关闭菜单
   */
  function closeMenu(menuItems, mainButton) {
    // 旋转主按钮图标回原位
    mainButton.querySelector('i').classList.remove('floating-ball-rotate-icon');

    // 隐藏菜单项
    menuItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = 'translate(0, 0)';
        item.classList.remove('opacity-100');
      }, (menuItems.length - index - 1) * 50);
    });
  }

  /**
   * 销毁组件
   */
  function destroy(container) {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }

  /**
   * 应用插件
   */
  function applyPlugins(config) {
    config.plugins.forEach(plugin => {
      if (typeof plugin === 'function') {
        plugin();
      }
    });
  }

  // 对外暴露初始化函数
  FloatingBall.create = create;
  FloatingBall.createBaiduAnalyticsPlugin = createBaiduAnalyticsPlugin;
  FloatingBall.createFooterPlugin = createFooterPlugin;


})(window, document);
