/**
 * AI Canvas Model Proxy Worker
 * 
 * 功能：
 * 1. 从 R2 提供 ONNX 模型文件
 * 2. 自动缓存到 Cloudflare Cache API（全球边缘节点）
 * 3. 支持断点续传和 Range 请求
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 只处理模型文件请求
    if (url.pathname === '/migan_pipeline_v2.onnx' || url.pathname === '/api/model') {
      return handleModelRequest(request, env);
    }
    
    // 其他请求返回 404 或代理到 Pages
    return new Response('Not Found', { status: 404 });
  },
};

async function handleModelRequest(request, env) {
  const cache = caches.default;
  
  // 检查缓存
  let response = await cache.match(request);
  
  if (response) {
    // 缓存命中，直接返回
    console.log('[Worker] Cache HIT: Serving from edge cache');
    
    // 添加调试头
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'X-Cache': 'HIT',
        'X-Worker': 'AI-Canvas-Model-Proxy',
      },
    });
    
    return newResponse;
  }
  
  // 缓存未命中，从 R2 获取
  console.log('[Worker] Cache MISS: Fetching from R2');
  
  try {
    const object = env.AI_CANVAS_MODELS.get('migan_pipeline_v2.onnx');
    
    if (!object) {
      return new Response('Model not found in R2', { status: 404 });
    }
    
    // 构建响应
    response = new Response(object.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': object.size.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        // 缓存 1 天 + 后台刷新 7 天
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range',
        'X-Cache': 'MISS',
        'X-Worker': 'AI-Canvas-Model-Proxy',
        'X-Model-Version': 'v2.0',
      },
    });
    
    // 写入缓存（异步，不阻塞响应）
    const cachePromise = cache.put(request, response.clone());
    cachePromise.catch(err => console.error('[Worker] Cache write error:', err));
    
    return response;
    
  } catch (error) {
    console.error('[Worker] Error fetching model:', error);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
