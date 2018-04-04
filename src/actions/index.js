export const GET_ALL_CATEGORY = 'GET_ALL_CATEGORY' //获取全部类别
export const GET_ALL_POSTS = 'GET_ALL_POSTS'     //获取全部帖子
export const GET_CATEGORY_POSTS = 'GET_CATEGORY_POSTS' //获取个别类别
export const EDIT_RANK = 'EDIT_RANK' //排序
export const ADD_POSTS = 'ADD_POSTS' //添加新帖子
export const CONTROL_VOTE = 'CONTROL_VOTE' //点赞帖子
export const EDIT_POSTS = 'EDIT_POSTS' //修改帖子
export const DELETE_POSTS = 'DELETE_POSTS' //删除帖子
export const GET_POSTS = 'GET_POSTS' //查询单个帖子
export const GET_ALL_VOTE = 'GET_ALL_VOTE' //查询单个帖子所以评论
export const VOTE_RANK = 'VOTE_RANK' //评论排序
export const ADD_VOTE = 'ADD_VOTE' //添加新评论
export const CONTROL_THUMB = 'CONTROL_THUMB' //点赞评论
export const DELETE_VOTE = 'DELETE_VOTE' //删除评论
export const EDIT_VOTE = 'EDIT_VOTE' //修改评论



export function getAllCategory (Category) {
  return {
    type: GET_ALL_CATEGORY,
    Category
  }
}


export function getAllPosts (Posts) {
  return {
    type: GET_ALL_POSTS,
    Posts
  }
}

export function getCategoryPosts (Posts) {
  return {
    type: GET_CATEGORY_POSTS,
    Posts
  }
}

export function rankPosts (Posts) {
  return {
    type: EDIT_RANK,
    Posts
  }
}

export function AddPosts (Posts) {
  return {
    type: ADD_POSTS,
    Posts
  }
}

export function ControlVote (id,voteScore) {
  return {
    type: CONTROL_VOTE,
    id,
    voteScore
  }
}

export function editPosts(id,title,body) {
  return {
    type: EDIT_POSTS,
    id,
    title,
    body
  }
}

export function DeletePosts (id) {
  return {
    type: DELETE_POSTS,
    id
  }
}

export function getPosts (id) {
  return {
    type: GET_POSTS,
    id
  }
}

export function getAllVote (Vote) {
  return {
    type: GET_ALL_VOTE,
    Vote
  }
}
export function rankVote (Vote) {
  return {
    type: VOTE_RANK,
    Vote
  }
}

export function AddVote (Vote) {
  return {
    type: ADD_VOTE,
    Vote
  }
}

export function ControlThumb (id,voteScore) {
  return {
    type: CONTROL_THUMB,
    id,
    voteScore
  }
}

export function DeleteVote (id) {
  return {
    type: DELETE_VOTE,
    id
  }
}
export function EditVote (id,body) {
  return {
    type: EDIT_VOTE,
    id,
    body
  }
}

