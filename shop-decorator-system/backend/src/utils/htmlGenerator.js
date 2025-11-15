/**
 * 将 H5-Dooring 数据转换为 HTML
 */

function generateHTML(designData) {
  const pointData = Array.isArray(designData) ? designData : (designData.pointData || [])

  // HTML 模板
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>店铺装修页面</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }

    .page-container {
      max-width: 750px;
      margin: 0 auto;
      background-color: #fff;
      position: relative;
    }

    .component {
      position: absolute;
    }

    .component img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* 组件样式 */
    .text-component {
      padding: 10px;
    }

    .image-component img {
      width: 100%;
    }

    .button-component {
      display: inline-block;
      padding: 10px 20px;
      background-color: #409eff;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page-container">
    ${renderComponents(pointData)}
  </div>

  <script>
    // 页面交互逻辑
    console.log('页面加载完成');
  </script>
</body>
</html>`

  return html
}

function renderComponents(pointData) {
  if (!Array.isArray(pointData) || pointData.length === 0) {
    return '<div style="padding: 40px; text-align: center; color: #999;">暂无内容</div>'
  }

  return pointData.map(component => {
    const { type, h, w, x, y, config } = component

    const style = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${w}px;
      height: ${h}px;
    `.trim()

    // 根据组件类型渲染不同的 HTML
    switch (type) {
      case 'Text':
        return `<div class="component text-component" style="${style}">
          <p>${config?.text || '文本内容'}</p>
        </div>`

      case 'Image':
      case 'Pic':
        return `<div class="component image-component" style="${style}">
          <img src="${config?.imgUrl || config?.url || ''}" alt="图片" />
        </div>`

      case 'Button':
        return `<div class="component button-component" style="${style}">
          <a href="${config?.link || '#'}">${config?.text || '按钮'}</a>
        </div>`

      default:
        return `<div class="component" style="${style}">
          <div style="padding: 10px;">${type}</div>
        </div>`
    }
  }).join('\n')
}

module.exports = {
  generateHTML
}
