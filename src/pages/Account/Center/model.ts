/*
 * @Author: dingyun
 * @Date: 2023-02-28 13:00:12
 * @LastEditors: dingyun
 * @Email: dingyun@zhuosoft.com
 * @LastEditTime: 2023-04-02 19:01:00
 * @Description:
 */
import { Action, Reducer } from '@umijs/max'
import { AccountCenterState as ModelState } from './data'

export interface ModelType {
  namespace: string
  state: ModelState
  reducers: {
    setAllNum: Reducer<ModelState, Action & ModelState>
    setArticlesNum: Reducer<ModelState, Action & Pick<ModelState, 'articlesNum'>>
    setCollectionsNum: Reducer<ModelState, Action & Pick<ModelState, 'collectionsNum'>>
    setFollowsNum: Reducer<ModelState, Action & Pick<ModelState, 'followsNum'>>
    setFollowersNum: Reducer<ModelState, Action & Pick<ModelState, 'followersNum'>>
  }
}

const Model: ModelType = {
  namespace: 'AccountCenter',
  state: {
    articlesNum: 0,
    collectionsNum: 0,
    followsNum: 0,
    followersNum: 0
  },

  reducers: {
    setAllNum(state, action) {
      return {
        ...state,
        articlesNum: action.articlesNum,
        collectionsNum: action.collectionsNum,
        followsNum: action.followsNum,
        followersNum: action.followersNum
      }
    },
    setArticlesNum(state, action) {
      return {
        ...state,
        articlesNum: action.articlesNum || 0
      }
    },
    setCollectionsNum(state, action) {
      return {
        ...state,
        collectionsNum: action.collectionsNum || 0
      }
    },
    setFollowsNum(state, action) {
      return {
        ...state,
        followsNum: action.followsNum || 0
      }
    },
    setFollowersNum(state, action) {
      return {
        ...state,
        followersNum: action.followersNum || 0
      }
    }
  }
}

export default Model
