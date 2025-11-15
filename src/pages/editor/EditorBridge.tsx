/**
 * 编辑器通信包装组件
 * 负责处理与父窗口的数据通信
 */

import React, { useEffect } from 'react'
import { connect } from 'dva'
import { parentBridge, MESSAGE_TYPES } from '@/utils/parentBridge'

interface EditorBridgeProps {
  dispatch?: any
  pstate?: any
  children: React.ReactNode
}

const EditorBridge: React.FC<EditorBridgeProps> = ({ dispatch, pstate, children }) => {
  useEffect(() => {
    // 监听加载数据请求
    const handleLoadData = (data: any) => {
      console.log('收到加载数据请求:', data)
      if (data && dispatch) {
        // 清空现有数据
        dispatch({
          type: 'editorModal/modPointData',
          payload: []
        })

        // 加载新数据
        if (Array.isArray(data)) {
          dispatch({
            type: 'editorModal/modPointData',
            payload: data
          })
        } else if (data.pointData) {
          dispatch({
            type: 'editorModal/modPointData',
            payload: data.pointData
          })
        }
      }
    }

    // 监听获取数据请求
    const handleGetData = () => {
      console.log('收到获取数据请求')
      if (pstate) {
        const pointData = pstate.pointData || []
        parentBridge.sendData(pointData)
      }
    }

    // 监听清空请求
    const handleClear = () => {
      console.log('收到清空请求')
      if (dispatch) {
        dispatch({
          type: 'editorModal/modPointData',
          payload: []
        })
      }
    }

    // 注册监听器
    parentBridge.on(MESSAGE_TYPES.LOAD_DATA, handleLoadData)
    parentBridge.on(MESSAGE_TYPES.GET_DATA, handleGetData)
    parentBridge.on(MESSAGE_TYPES.CLEAR, handleClear)

    // 通知父窗口编辑器已就绪
    // 延迟通知，确保编辑器完全加载
    const timer = setTimeout(() => {
      parentBridge.notifyReady()
      console.log('编辑器已就绪，通知父窗口')
    }, 1000)

    // 清理函数
    return () => {
      clearTimeout(timer)
      parentBridge.off(MESSAGE_TYPES.LOAD_DATA, handleLoadData)
      parentBridge.off(MESSAGE_TYPES.GET_DATA, handleGetData)
      parentBridge.off(MESSAGE_TYPES.CLEAR, handleClear)
    }
  }, [dispatch, pstate])

  // 监听数据变化，通知父窗口
  useEffect(() => {
    if (pstate && pstate.pointData) {
      // 数据变化时通知父窗口（防抖）
      const timer = setTimeout(() => {
        parentBridge.notifyDataChanged()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pstate?.pointData])

  return <>{children}</>
}

const mapStateToProps = (state: any) => {
  return {
    pstate: state.editorModal
  }
}

export default connect(mapStateToProps)(EditorBridge)
