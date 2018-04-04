const api = process.env.REACT_APP_CONTACTS_API_URL ||"http://localhost:3001"


let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

// 获取应用程序的所有可用类别
    export const getAll = () =>
  fetch(`${api}/categories`, { headers })
    .then(res => res.json())

// 获取特定类别的所有帖子。	
    export const category = (category) =>
  fetch(`${api}/${category}/posts`, { headers })
    .then(res => res.json())

//获取所有帖子。当没有选择类别时用于主页面。	
    export const getPosts = () =>
    fetch(`${api}/posts`, { headers })
      .then(res => res.json())

//添加新帖子。		
    export const add = (post) =>
   fetch(`${api}/posts`,  {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( post )
    }).then(res => res.json())

//获取单个帖子。
  export const getCard = (id) =>
  fetch(`${api}/posts/${id}`, { headers })
  .then(res => res.json())

//用于对帖子进行投票。
  export const addVote = (id,option) =>
  fetch(`${api}/posts/${id}`,  {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( {option} )
  })
  .then(res => res.json())
  
//编辑现有帖子的详细信息。	
  export const editCard = (id,edit) =>
  fetch(`${api}/posts/${id}`,  {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( edit )
  }).then(res => res.json())


  // 将帖子的已删除标志设置为“true”。
  // 将所有子注释的parentDeleted标志设置为“true”。
  export const Delete = (id) =>
  fetch(`${api}/posts/${id}`,{
     method: 'DELETE', 
     headers })
    .then(res => res.json())
  
// 获取单个帖子的所有评论。	
  export const getVote = (id) =>
  fetch(`${api}/posts/${id}/comments`, { headers })
  .then(res => res.json())

// 在帖子中添加评论。	
  export const addComment = (Comment) =>
  fetch(`${api}/comments`,  {
     method: 'POST',
     headers: {
       ...headers,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(Comment)
   }).then(res => res.json())
  

// 获取单个评论的详细信息。	
  export const getComment = (id) =>
  fetch(`${api}/comments/${id}`, { headers })
  .then(res => res.json())

// 用于对评论进行投票。	
  export const addCommentVote = (id,option) =>
  fetch(`${api}/comments/${id}`,  {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({option} )
  }).then(res => res.json())

// 编辑现有评论的详细信息。	
  export const editComments = (id,edit) =>
  fetch(`${api}/comments/${id}`,  {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( edit )
  }).then(res => res.json())


// 将评论的已删除标志设置为true。	
  export const DeleteComment = (id) =>
  fetch(`${api}/comments/${id}`,{
     method: 'DELETE', 
     headers })
    .then(res => res.json())