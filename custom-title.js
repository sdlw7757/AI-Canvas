document.addEventListener('DOMContentLoaded', function() {
  function preloadLocalModel() {
    var LOCAL_MODEL_KEY = 'migan-pipeline-v2';
    
    // 多级模型源配置（按优先级排序）
    var MODEL_SOURCES = [
      // 1. Cloudflare R2/Worker（全球 CDN，最快）
      {
        url: 'https://ai-canvas-model-proxy.your-subdomain.workers.dev/migan_pipeline_v2.onnx',
        name: 'Cloudflare CDN',
        priority: 1
      },
      // 2. 本地文件（GitHub Pages / 静态托管）
      {
        url: '/migan_pipeline_v2.onnx',
        name: 'Local file',
        priority: 2
      },
      // 3. HuggingFace 远程（兜底方案）
      {
        url: 'https://huggingface.co/andraniksargsyan/migan/resolve/main/migan_pipeline_v2.onnx',
        name: 'HuggingFace Remote',
        priority: 3
      }
    ];
    
    var STORE_NAME = 'modelCache';

    function openDB() {
      var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      if (!indexedDB) return Promise.reject(new Error('IndexedDB not supported'));
      return new Promise(function(resolve, reject) {
        var req = indexedDB.open('localforage');
        req.onupgradeneeded = function() {};
        req.onsuccess = function() { resolve(req.result); };
        req.onerror = function() { reject(req.error); };
      });
    }

    function checkModelExists(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var store = tx.objectStore(STORE_NAME);
        var req = store.get(LOCAL_MODEL_KEY);
        req.onsuccess = function() { resolve(req.result != null); };
        req.onerror = function() { reject(req.error); };
      });
    }

    function saveModelToDB(db, buffer) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        store.put(buffer, LOCAL_MODEL_KEY);
        tx.oncomplete = function() { resolve(); };
        tx.onerror = function() { reject(tx.error); };
      });
    }
    
    // 尝试从多个源下载模型
    async function tryDownloadFromSources(sources) {
      for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        
        try {
          console.log('[AI Canvas] Trying source #' + source.priority + ': ' + source.name + ' (' + source.url + ')');
          
          var startTime = Date.now();
          var response = await fetch(source.url, {
            method: 'GET',
            cache: 'default'
          });
          
          if (!response.ok) {
            console.warn('[AI Canvas] Source failed (' + response.status + '): ' + source.name);
            continue;
          }
          
          var buffer = await response.arrayBuffer();
          var duration = ((Date.now() - startTime) / 1000).toFixed(1);
          
          console.log(
            '%c[AI Canvas] ✅ Download successful from ' + source.name + 
            ' (' + (buffer.byteLength / 1024 / 1024).toFixed(1) + ' MB in ' + duration + 's)',
            'color: #10b981; font-weight: bold;'
          );
          
          return buffer;
          
        } catch (error) {
          console.warn('[AI Canvas] Source error: ' + source.name + ' - ' + error.message);
          continue;
        }
      }
      
      throw new Error('All sources failed');
    }

    openDB().then(function(db) {
      return checkModelExists(db).then(function(exists) {
        if (exists) { 
          console.log('%c[AI Canvas] 🚀 Model already cached, skipping download', 
            'color: #3b82f6; font-weight: bold;');
          db.close(); 
          return; 
        }
        
        console.log('%c[AI Canvas] Preloading ONNX model...', 
          'color: #f59e0b; font-weight: bold;');
        
        return tryDownloadFromSources(MODEL_SOURCES).then(function(buffer) {
          return saveModelToDB(db, buffer);
        }).then(function(buffer) {
          console.log(
            '%c[AI Canvas] 💾 Model cached to IndexedDB successfully! Next visit will be instant.', 
            'color: #10b981; font-weight: bold;'
          );
          db.close();
        }).catch(function(err) {
          console.warn(
            '%c[AI Canvas] ⚠️ Model preload failed: ' + err.message + 
            '\nWill fallback to remote on first use.',
            'color: #ef4444;'
          );
          db.close();
        });
      });
    }).catch(function(err) {
      console.warn('[AI Canvas] Cannot access IndexedDB:', err.message || err);
    });
  }

  preloadLocalModel();
  function replaceTitle() {
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var node;
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.includes('Inpaint-web')) {
        node.textContent = node.textContent.replace(/Inpaint-web/g, 'AI Canvas');
      }
    }
  }

  function removeUpscaleButton() {
    var buttons = document.querySelectorAll('[role="button"], button, .inline-flex');
    buttons.forEach(function(btn) {
      var text = btn.textContent || '';
      var trimmed = text.trim();
      if (trimmed === '4 倍放大' || trimmed === '4x Upscale' || trimmed === 'upscale' ||
          trimmed.includes('4倍') || trimmed.includes('放大') && trimmed.includes('4') ||
          trimmed.toLowerCase().includes('upscale') || trimmed.toLowerCase().includes('4x')) {
        console.log('[AI Canvas] Removing upscale button:', trimmed);
        btn.style.display = 'none';
        setTimeout(function() { btn.remove(); }, 100);
      }
    });
  }

  function replaceFeedbackLinks() {
    var links = document.querySelectorAll('a[href*="lxfater/inpaint-web"]');
    links.forEach(function(link) {
      link.href = 'https://github.com/sdlw7757/AI-Canvas';
      if (link.textContent.trim() === 'Inpaint-web') {
        link.textContent = 'AI Canvas';
      }
    });
  }

  function replaceFeedbackText() {
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var node;
    while (node = walker.nextNode()) {
      if (node.textContent && node.textContent.includes('联系作者')) {
        node.textContent = node.textContent.replace(/联系作者/g, '支持作者');
      }
      if (node.textContent && node.textContent.includes('About me')) {
        node.textContent = node.textContent.replace(/About me/g, 'Support');
      }
    }
  }

  function hijackFeedbackModal() {
    var modals = document.querySelectorAll('.text-xl.space-y-5');
    modals.forEach(function(modal) {
      var text = modal.textContent || '';
      if (text.includes('反馈') || text.includes('feedback')) {
        if (modal.dataset.hijacked) return;
        modal.dataset.hijacked = 'true';
        modal.innerHTML = '';

        var title = document.createElement('div');
        title.className = 'tip-modal-title';
        title.textContent = '☕ 支持作者';
        title.style.fontSize = '1.25rem';
        title.style.fontWeight = '700';
        title.style.color = '#e2e8f0';
        title.style.marginBottom = '6px';

        var subtitle = document.createElement('div');
        subtitle.className = 'tip-modal-subtitle';
        subtitle.textContent = '纯公益非盈利，善款专款专用，全部用于服务器、域名及功能维护。感恩支持。';
        subtitle.style.fontSize = '0.85rem';
        subtitle.style.color = 'rgba(148,163,184,0.8)';
        subtitle.style.marginBottom = '24px';

        var grid = document.createElement('div');
        grid.className = 'tip-qr-grid';

        var wechatCard = createQRCard('examples/wechat-qr.png', '微信赞赏', '微信扫码支持');
        var alipayCard = createQRCard('examples/alipay-qr.jpg', '支付宝赞赏', '支付宝扫码支持');

        grid.appendChild(wechatCard);
        grid.appendChild(alipayCard);

        modal.appendChild(title);
        modal.appendChild(subtitle);
        modal.appendChild(grid);
      }
    });
  }

  function createQRCard(src, label, desc) {
    var card = document.createElement('div');
    card.className = 'tip-qr-card';

    var img = document.createElement('img');
    img.src = src;
    img.alt = label;

    var labelEl = document.createElement('div');
    labelEl.className = 'tip-qr-label';
    labelEl.textContent = label;

    var descEl = document.createElement('div');
    descEl.className = 'tip-qr-desc';
    descEl.textContent = desc;

    card.appendChild(img);
    card.appendChild(labelEl);
    card.appendChild(descEl);
    return card;
  }

  function processNode(node) {
    if (node.nodeType === 3) {
      if (node.textContent && node.textContent.includes('Inpaint-web')) {
        node.textContent = node.textContent.replace(/Inpaint-web/g, 'AI Canvas');
      }
      if (node.textContent && node.textContent.includes('联系作者')) {
        node.textContent = node.textContent.replace(/联系作者/g, '支持作者');
      }
      if (node.textContent && node.textContent.includes('About me')) {
        node.textContent = node.textContent.replace(/About me/g, 'Support');
      }
    } else if (node.nodeType === 1) {
      var tag = node.tagName;
      var role = node.getAttribute && node.getAttribute('role');
      var cls = node.className || '';
      var text = (node.textContent || '').trim();

      var isButton =
        tag === 'BUTTON' ||
        role === 'button' ||
        cls.indexOf('inline-flex') >= 0;

      if (isButton && (text === '4 倍放大' || text === '4x Upscale' || text === 'upscale' ||
          text.includes('4倍') || (text.includes('放大') && text.includes('4')) ||
          text.toLowerCase().includes('upscale') || text.toLowerCase().includes('4x'))) {
        console.log('[AI Canvas] Removing upscale button in processNode:', text);
        node.style.display = 'none';
        setTimeout(function() { node.remove(); }, 100);
        return;
      }
    }
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 3) {
            if (node.textContent && node.textContent.includes('Inpaint-web')) {
              node.textContent = node.textContent.replace(/Inpaint-web/g, 'AI Canvas');
            }
            if (node.textContent && node.textContent.includes('联系作者')) {
              node.textContent = node.textContent.replace(/联系作者/g, '支持作者');
            }
            if (node.textContent && node.textContent.includes('About me')) {
              node.textContent = node.textContent.replace(/About me/g, 'Support');
            }
          } else if (node.nodeType === 1) {
            processNode(node);
            var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
            var textNode;
            while (textNode = walker.nextNode()) {
              if (textNode.textContent && textNode.textContent.includes('Inpaint-web')) {
                textNode.textContent = textNode.textContent.replace(/Inpaint-web/g, 'AI Canvas');
              }
              if (textNode.textContent && textNode.textContent.includes('联系作者')) {
                textNode.textContent = textNode.textContent.replace(/联系作者/g, '支持作者');
              }
              if (textNode.textContent && textNode.textContent.includes('About me')) {
                textNode.textContent = textNode.textContent.replace(/About me/g, 'Support');
              }
            }
          }
        });
      }
      if (mutation.type === 'characterData') {
        var target = mutation.target;
        if (target.textContent && target.textContent.includes('Inpaint-web')) {
          target.textContent = target.textContent.replace(/Inpaint-web/g, 'AI Canvas');
        }
        if (target.textContent && target.textContent.includes('联系作者')) {
          target.textContent = target.textContent.replace(/联系作者/g, '支持作者');
        }
        if (target.textContent && target.textContent.includes('About me')) {
          target.textContent = target.textContent.replace(/About me/g, 'Support');
        }
      }
    });
    replaceFeedbackLinks();
    hijackFeedbackModal();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  replaceTitle();
  removeUpscaleButton();
  replaceFeedbackLinks();
  replaceFeedbackText();

  setTimeout(replaceTitle, 500);
  setTimeout(replaceTitle, 1500);
  setTimeout(removeUpscaleButton, 500);
  setTimeout(removeUpscaleButton, 1000);
  setTimeout(removeUpscaleButton, 2000);
  setTimeout(removeUpscaleButton, 3000);
});
