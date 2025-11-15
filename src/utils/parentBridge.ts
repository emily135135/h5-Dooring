/**
 * H5-Dooring 父窗口通信工具
 * 用于在 iframe 中与父窗口进行通信
 */

export interface MessageData {
  type: string
  data?: any
}

class ParentBridge {
  private listeners: Map<string, Function[]>
  private parentOrigin: string

  constructor() {
    this.listeners = new Map()
    this.parentOrigin = window.location.origin
    this.setupMessageListener()
  }

  /**
   * 设置消息监听器
   */
  private setupMessageListener() {
    window.addEventListener('message', (event: MessageEvent) => {
      // 安全检查
      if (event.origin !== this.parentOrigin) {
        return
      }

      const { type, data } = event.data as MessageData

      // 触发对应的回调函数
      if (this.listeners.has(type)) {
        const callbacks = this.listeners.get(type)!
        callbacks.forEach(callback => callback(data))
      }
    })
  }

  /**
   * 向父窗口发送消息
   */
  send(type: string, data?: any) {
    if (!window.parent) {
      console.error('No parent window found')
      return
    }

    window.parent.postMessage(
      { type, data },
      this.parentOrigin
    )
  }

  /**
   * 监听来自父窗口的消息
   */
  on(type: string, callback: Function) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type)!.push(callback)
  }

  /**
   * 移除监听器
   */
  off(type: string, callback: Function) {
    if (!this.listeners.has(type)) return

    const callbacks = this.listeners.get(type)!
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  }

  /**
   * 通知父窗口编辑器已就绪
   */
  notifyReady() {
    this.send('EDITOR_READY')
  }

  /**
   * 通知父窗口数据已变化
   */
  notifyDataChanged() {
    this.send('DATA_CHANGED')
  }

  /**
   * 请求父窗口保存
   */
  requestSave() {
    this.send('SAVE_REQUEST')
  }

  /**
   * 响应获取数据请求
   */
  sendData(data: any) {
    this.send('GET_DATA_RESPONSE', data)
  }
}

// 导出单例
export const parentBridge = new ParentBridge()

// 消息类型常量
export const MESSAGE_TYPES = {
  // 从父窗口接收
  LOAD_DATA: 'LOAD_DATA',
  GET_DATA: 'GET_DATA',
  CLEAR: 'CLEAR',

  // 发送到父窗口
  READY: 'EDITOR_READY',
  GET_DATA_RESPONSE: 'GET_DATA_RESPONSE',
  DATA_CHANGED: 'DATA_CHANGED',
  SAVE_REQUEST: 'SAVE_REQUEST'
}
