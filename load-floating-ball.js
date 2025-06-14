/**
 * 悬浮球组件加载器 - 负责资源管理和初始化流程
 * 引入此文件后会自动加载floating-ball.js和floating-ball.css并初始化组件
 */
(function(window, document) {
  // 立即保存当前脚本引用
  const currentScript = document.currentScript;

  // 确保命名空间存在
  const FloatingBall = window.FloatingBall = window.FloatingBall || {};

  // 默认配置（仅包含加载器相关配置）
  const defaultLoaderConfig = {
    load_font_awesome: true,
    load_styles: true,
    load_core: true,
    auto_init: true,
    core_script_path: '/floating-ball/floating-ball.js',
    style_path: '/floating-ball/floating-ball.css',
    init_timeout: 5000 // 初始化超时时间（毫秒）
  };

  // 当前加载器配置
  let loaderConfig = {};

  // 资源加载状态
  const loadedResources = new Map();
  let initializationAttempted = false;

  /**
   * 加载外部资源
   */
  function loadResource(url, type) {
    if (loadedResources.has(url)) {
      return loadedResources.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      let element;

      if (type === 'script') {
        element = document.createElement('script');
        element.src = url;
        element.async = false; // 确保按顺序加载
      } else if (type === 'stylesheet') {
        element = document.createElement('link');
        element.href = url;
        element.rel = 'stylesheet';
      } else {
        reject(new Error(`不支持的资源类型: ${type}`));
        return;
      }

      // 设置超时处理
      const timeoutId = setTimeout(() => {
        element.onerror(new Error(`资源加载超时: ${url}`));
      }, 5000);

      element.onload = () => {
        clearTimeout(timeoutId);
        // console.log(`资源加载成功: ${url}`);
        loadedResources.set(url, Promise.resolve());
        resolve();
      };

      element.onerror = (error) => {
        clearTimeout(timeoutId);
        const message = `资源加载失败: ${url}`;
        console.error(message, error);
        loadedResources.set(url, Promise.reject(new Error(message)));
        reject(new Error(message));
      };

      document.head.appendChild(element);
    });

    loadedResources.set(url, promise);
    return promise;
  }

  /**
   * 等待核心库准备就绪
   */
  function waitForCoreLibrary(timeout) {
    return new Promise((resolve, reject) => {
      const checkInterval = 100;
      let elapsedTime = 0;

      const check = () => {
        if (window.FloatingBall && typeof window.FloatingBall.create === 'function') {
          resolve(window.FloatingBall);
          return;
        }

        elapsedTime += checkInterval;
        if (elapsedTime >= timeout) {
          reject(new Error(`等待核心库超时（${timeout}ms）：FloatingBall.create 未定义`));
          return;
        }

        setTimeout(check, checkInterval);
      };

      check();
    });
  }

  /**
   * 初始化悬浮球组件
   */
  function initialize(config) {
    //console.log("in initialize, config=", config);
    if (initializationAttempted) {
      return Promise.reject(new Error('悬浮球组件已尝试初始化，请勿重复操作'));
    }
    initializationAttempted = true;

    const mergedConfig = { ...defaultLoaderConfig, ...config };
    //console.log("mergedConfig=", mergedConfig);

    // 加载依赖资源
    const resourcesToLoad = [];
    
    if (mergedConfig.load_font_awesome) {
      resourcesToLoad.push(loadResource('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css', 'stylesheet'));
    }
    
    if (mergedConfig.load_styles) {
      resourcesToLoad.push(loadResource(mergedConfig.style_path, 'stylesheet'));
    }
    
    if (mergedConfig.load_core) {
      resourcesToLoad.push(loadResource(mergedConfig.core_script_path, 'script'));
    }

    // 当所有资源加载完成后
    return Promise.all(resourcesToLoad)
      .then(() => {
        // 等待核心库完全初始化
        return waitForCoreLibrary(mergedConfig.init_timeout);
      })
      .then(() => {
        // 检查核心API是否可用
        if (!window.FloatingBall || typeof window.FloatingBall.create !== 'function') {
          throw new Error('核心库API缺失：FloatingBall.create 未定义');
        }
        
        // 获取用户配置（如果有）
        const userConfig = window.floatingBallConfig || {};
        //console.log("userConfig=", userConfig);
        
        // 调用核心库的创建方法
        return window.FloatingBall.create({ ...mergedConfig, ...userConfig });
      })
      .catch(error => {
        console.error('悬浮球组件初始化失败:', error);
        throw error;
      });
  }

  /**
   * 公开API
   */
  window.FloatingBallLoader = {
    load: initialize,
    createBaiduAnalyticsPlugin: FloatingBall.createBaiduAnalyticsPlugin || (() => () => {}),
    createFooterPlugin: FloatingBall.createFooterPlugin || (() => () => {})
  };

  /**
   * 自动初始化
   */
  function autoInitialize() {
    const scriptConfig = {};
    
    if (currentScript) {
      // 从script标签的data属性获取配置
      Array.from(currentScript.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          const key = attr.name.replace('data-', '');
          scriptConfig[key] = attr.value;
        }
      });
    }
    //console.log("criptConfig=", scriptConfig);

    // 合并配置并转换类型
    const finalConfig = mergeAndConvertTypes(defaultLoaderConfig, scriptConfig);

    if (finalConfig.hasOwnProperty('auto_init') && String(finalConfig.auto_init).toLowerCase() === 'false') {
      console.error("已关闭自动加载初始化，直接取消本次自动初始化");
      return;
    }
    
    // 初始化组件
    //console.log("finalConfig=", finalConfig);
    initialize(finalConfig);
  }

  /**
   * 根据默认配置自动识别获取的配置类型并转换
   */
  function mergeAndConvertTypes(defaults, overrides) {
    const result = { ...defaults };
    
    for (const key in overrides) {
      if (defaults.hasOwnProperty(key)) {
        const defaultValue = defaults[key];
        const overrideValue = overrides[key];
        
        // 根据默认值的类型进行转换
        if (typeof defaultValue === 'boolean') {
          result[key] = overrideValue === 'true';
        } else if (typeof defaultValue === 'number') {
          result[key] = Number(overrideValue);
        } else if (Array.isArray(defaultValue) || defaultValue === null) {
          try {
            result[key] = JSON.parse(overrideValue);
          } catch (e) {
            // 转换失败则使用默认值
          }
        } else if (typeof defaultValue === 'object' && defaultValue !== null) {
          try {
            result[key] = { ...defaults[key], ...JSON.parse(overrideValue) };
          } catch (e) {
            // 转换失败则使用默认值
          }
        } else {
          // 字符串或其他类型
          result[key] = overrideValue;
        }

      } else {
        // 处理默认值不存在的新key
        result[key] = convertType(overrides[key]);
      }
    }
    
    return result;
  }

  /**
   * 根据值的格式来自动推断类型并转换
   */
  function convertType(value) {

    // 转换null
    if (value === 'null') return null;

    // 转换布尔值
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // 转换数字
    const num = Number(value);
    if (!isNaN(num) && value.trim() !== '') return num;
    
    // 转换JSON对象/数组
    try {
      return JSON.parse(value);
    } catch (e) {
      // 如果不是有效的JSON，返回原始字符串
      return value;
    }
  }

  // 仅当 URL 中不包含 floating-ball=0 时执行初始化
  if (new URLSearchParams(window.location.search).get('floating-ball') !== '0') {
    // 当DOM加载完成后自动初始化
    if (document.readyState === 'loading') {
      //console.log("waiting to run.");
      document.addEventListener('DOMContentLoaded', autoInitialize);
    } else {
      autoInitialize();
      //console.log("run now");
    }
  }

})(window, document);    
