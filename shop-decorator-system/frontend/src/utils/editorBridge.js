/**
 * H5-Dooring 编辑器通信工具类
 * 用于 Vue 应用与 iframe 中的 h5-Dooring 编辑器进行数据通信
 */

export class EditorBridge {
  constructor(iframeEl) {
    this.iframe = iframeEl
    this.listeners = new Map()
    this.setupMessageListener()
  }

  /**
   * 设置消息监听器
   */
  setupMessageListener() {
    window.addEventListener('message', (event) => {
      // 安全检查：验证消息来源
      const editorOrigin = window.location.origin
      if (event.origin !== editorOrigin) {
        return
      }

      const { type, data } = event.data

      // 触发对应的回调函数
      if (this.listeners.has(type)) {
        const callbacks = this.listeners.get(type)
        callbacks.forEach(callback => callback(data))
      }
    })
  }

  /**
   * 向编辑器发送消息
   */
  send(type, data) {
    if (!this.iframe || !this.iframe.contentWindow) {
      console.error('iframe not ready')
      return
    }

    this.iframe.contentWindow.postMessage(
      { type, data },
      window.location.origin
    )
  }

  /**
   * 监听来自编辑器的消息
   */
  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type).push(callback)
  }

  /**
   * 移除监听器
   */
  off(type, callback) {
    if (!this.listeners.has(type)) return

    const callbacks = this.listeners.get(type)
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  /**
   * 加载设计数据到编辑器
   */
  loadData(data) {
    this.send('LOAD_DATA', data)
  }

  /**
   * 从编辑器获取数据
   */
  getData() {
    return new Promise((resolve) => {
      // 设置一次性监听器
      const handler = (data) => {
        this.off('GET_DATA_RESPONSE', handler)
        resolve(data)
      }
      this.on('GET_DATA_RESPONSE', handler)

      // 请求数据
      this.send('GET_DATA')
    })
  }

  /**
   * 清空编辑器
   */
  clear() {
    this.send('CLEAR')
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.listeners.clear()
  }
}

// 消息类型常量
export const MESSAGE_TYPES = {
  // 从父窗口发送到编辑器
  LOAD_DATA: 'LOAD_DATA',           // 加载数据
  GET_DATA: 'GET_DATA',             // 获取数据
  CLEAR: 'CLEAR',                   // 清空

  // 从编辑器发送到父窗口
  READY: 'EDITOR_READY',            // 编辑器就绪
  GET_DATA_RESPONSE: 'GET_DATA_RESPONSE', // 返回数据
  DATA_CHANGED: 'DATA_CHANGED',     // 数据变化
  SAVE_REQUEST: 'SAVE_REQUEST'      // 请求保存
}
