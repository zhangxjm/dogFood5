import request from '../utils/request'

export const getScriptTypeList = () => request({ url: '/script-type/list', method: 'get' })
export const getScriptTypeById = (id) => request({ url: `/script-type/${id}`, method: 'get' })
export const addScriptType = (data) => request({ url: '/script-type/add', method: 'post', data })
export const updateScriptType = (data) => request({ url: '/script-type/update', method: 'post', data })
export const deleteScriptType = (id) => request({ url: `/script-type/${id}`, method: 'delete' })

export const getScriptInventoryList = () => request({ url: '/script-inventory/list', method: 'get' })
export const getScriptInventoryById = (id) => request({ url: `/script-inventory/${id}`, method: 'get' })
export const getScriptInventoryByType = (typeId) => request({ url: `/script-inventory/type/${typeId}`, method: 'get' })
export const addScriptInventory = (data) => request({ url: '/script-inventory/add', method: 'post', data })
export const updateScriptInventory = (data) => request({ url: '/script-inventory/update', method: 'post', data })
export const deleteScriptInventory = (id) => request({ url: `/script-inventory/${id}`, method: 'delete' })

export const getSessionRecordList = () => request({ url: '/session-record/list', method: 'get' })
export const getSessionRecordById = (id) => request({ url: `/session-record/${id}`, method: 'get' })
export const getSessionRecordByScript = (scriptId) => request({ url: `/session-record/script/${scriptId}`, method: 'get' })
export const addSessionRecord = (data) => request({ url: '/session-record/add', method: 'post', data })
export const updateSessionRecord = (data) => request({ url: '/session-record/update', method: 'post', data })
export const deleteSessionRecord = (id) => request({ url: `/session-record/${id}`, method: 'delete' })

export const getPlayerRecordList = () => request({ url: '/player-record/list', method: 'get' })
export const getPlayerRecordById = (id) => request({ url: `/player-record/${id}`, method: 'get' })
export const getPlayerRecordBySession = (sessionId) => request({ url: `/player-record/session/${sessionId}`, method: 'get' })
export const addPlayerRecord = (data) => request({ url: '/player-record/add', method: 'post', data })
export const updatePlayerRecord = (data) => request({ url: '/player-record/update', method: 'post', data })
export const deletePlayerRecord = (id) => request({ url: `/player-record/${id}`, method: 'delete' })
