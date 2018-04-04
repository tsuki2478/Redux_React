import {
    GET_ALL_CATEGORY,
    GET_ALL_POSTS,
    GET_CATEGORY_POSTS,
    EDIT_RANK,
    ADD_POSTS,
    CONTROL_VOTE,
    EDIT_POSTS,
    DELETE_POSTS,
    GET_POSTS,
    GET_ALL_VOTE,
    VOTE_RANK,
    ADD_VOTE,
    CONTROL_THUMB,
    DELETE_VOTE,
    EDIT_VOTE,
} from '../actions';
import {combineReducers} from 'redux'

// 类别
function Category(state = {}, action) {
    const {Category} = action
    switch (action.type) {
        case GET_ALL_CATEGORY:
            return {
                ...state,
                categories: Category.categories
            }
        default:
            return state
    }
}

const initialCalendarState = {
//可以给状态store默认值
}

//贴子
function Posts(state = {}, action) {
    const {Posts,voteScore, id, body, title} = action
    switch (action.type) {
        case GET_ALL_POSTS:
            return {
                ...state,
                Posts: Posts
            }
        case GET_CATEGORY_POSTS:
            return {
                ...state,
                Posts: Posts
            }
        case EDIT_RANK:
            return {
                ...state,
                Posts:  Posts
            }
        case ADD_POSTS:
            state.Posts.concat(Posts)
            return {
                ...state,
                Posts:state.Posts
            }
        case CONTROL_VOTE:
        state.Posts.map((state)=>{
            if(id === state.id) {
            state.voteScore =voteScore
            }
        })
         return {
            ...state,
            Posts:state.Posts
            }
        case EDIT_POSTS:
        state.Posts.map((state)=>{
                if(id === state.id) {
                state.body =body;
                state.title =title;
                }
            })
             return {
                ...state,
                Posts:state.Posts
                }  
        case DELETE_POSTS:              
        state = state.Posts.filter((c) => c.id !== id)
        return {
                ...state,
                Posts:state
                }                
        case GET_POSTS:
        state.Posts = state.Posts.filter((c) => c.id === id)
            return {
                ...state,
                Posts: state.Posts
            }
        default:
            return state
    }
}

function Vote(state = {}, action) {
    const {Vote,id,body,voteScore} = action
    switch (action.type) {
        case GET_ALL_VOTE:
           return {
            ...state,
            Vote:Vote
           }
           case VOTE_RANK:
           return {
               ...state,
               Vote:Vote
           }
           case ADD_VOTE:
           state=state.Vote.concat(Vote)
           return {
               ...state,
               Vote:state
           }
           case DELETE_VOTE:              
           state = state.Vote.filter((c) => c.id !== id)
           return {
                   ...state,
                   Vote:state
                   } 
            case EDIT_VOTE:
            state.Vote.map((state)=>{
                if(id === state.id) {
                state.body =body;
                }
            })
             return {
                ...state,
                Posts:state.Vote
                } 
            case CONTROL_THUMB:
            state.Vote.map((state)=>{
                if(id === state.id) {
                state.voteScore = voteScore
                }
            })
                return {
                    ...state,
                    Posts:state.Vote
                 }
        default:
           return state
    }
   
}
export default combineReducers({Category, Posts,Vote})
