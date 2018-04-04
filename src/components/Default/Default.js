import React from 'react';
import './defaultCss.css';
import {connect} from 'react-redux';
import * as api from '../../utils/api'
import {
    getAllCategory,
    getAllPosts,
    getCategoryPosts,
    rankPosts,
    ControlVote,
    DeletePosts,
} from '../../actions'
import * as _ from 'lodash';
import MdArrowDropUp from "react-icons/lib/md/arrow-drop-up";
import MdArrowDropDown from "react-icons/lib/md/arrow-drop-down";
import MdEdit from "react-icons/lib/md/edit";
import MdDelete from "react-icons/lib/md/delete";
import {
    BrowserRouter as Router,
    Link,
    Route,
    withRouter
} from "react-router-dom";
import CategoryPage from "../category/CategoryPage";

class Default extends React.Component {
    state = {
        startCategory: false,
        startPosts: false
    }

    //获取全部分类
    getCategory = () => {
        api
            .getAll()
            .then((contacts) => {
                this
                    .props
                    .getCategory(contacts);
                this.setState(() => ({startCategory: true}))
                console.group("获取应用程序的所有可用类别")
                console.log(contacts);
                console.groupEnd();
            })
    }
    //获取全部帖子
    getAllPosts = () => {
        api
            .getPosts()
            .then((contacts) => {
                this
                    .props
                    .getAllPosts(contacts);
                this.setState(() => ({startPosts: true, Selected: "none"}))
                console.group("获取所有帖子。当没有选择类别时用于主页面。")
                console.log(contacts);
                console.groupEnd();
            })
    }
    // 进入页面加载
    componentDidMount() {
        this.getCategory();
        this.getAllPosts();
        // console.log('本项目,因redux和react方法共同使用，物理返回键有点问题，根目录页的生命周期再次没有加载..导致redux的状态没有更新
        // 。不难,调节redux传状态' +'管理..')
    }

    //排序
    handleChange(event, Posts) {
        console.log(event.target.value)
        Posts = _.sortBy(Posts, [function (o) {
                return -o.voteScore;
            }
        ])
        this
            .props
            .rankPosts(Posts);
    }
    //点赞
    UpDownVote(event, id) {
        console.log(event)
        console.log(id)
        if (event && id) {
            api
                .addVote(id, event)
                .then((contacts) => {
                    this
                        .props
                        .ControlVote(contacts.id, contacts.voteScore);
                    console.group("用于对帖子进行投票")
                    console.log(contacts.voteScore + "-------" + contacts.id);
                    console.groupEnd();
                })

        } else {
            console.log("点击失效")
        }
    }
 
    // 删除
    delete(id) {
        // 将帖子的已删除标志设置为“true”。 将所有子注释的parentDeleted标志设置为“true”。
        api.Delete(id).then((contacts) => {
             this.props.DeletePosts(contacts.id)
                console.group("将帖子的已删除标志设置为“true”。")
                console.log(contacts);
                console.groupEnd();
            })
    }
    render() {
        const {Selected, Category, SearchCategory, Posts, editPosts,intoPosts} = this.props
        const {startCategory, startPosts} = this.state
        // console.log(this.props.history.action) //可以判断是否是物理键返回 

        return (
            <div className="App">
                <div className="myName">
                    Welcome to Tsuki2478’s Project
                    <Link to="/create" className='add-contact'>Add Contact</Link>
                </div>

                {/*选中类别 */}
                <div className="Category">
                    <select
                        value={this.props.Selected}
                        onChange={(event) => SearchCategory(event)}
                        className="select">
                        <option value="none">所有类别</option>
                        {startCategory && Category.categories && Category
                            .categories
                            .map((Category) => (
                                <option key={Category.path} value={Category.name}>{Category.name}
                                </option>
                            ))}
                    </select>

                    <select
                        className="rank"
                        value="none"
                        onChange={(event) => this.handleChange(event, this.props.Posts)}>
                        <option value="none" disabled>排序</option>
                        <option value="voteScore">点赞量排序</option>
                    </select>

                </div>

                {/* 全部帖子 */}
                <div className="Posts">
                    <ul className="Posts-li">
                        <div className="Posts-Grid">
                            <li className="Posts-Title">标题</li>
                            <li className="Posts-author">作者</li>
                            <li className="Posts-Category">分类</li>
                            <li className="Posts-CommentCount">点赞量</li>
                        </div>
                    </ul>
                    <ul className="Posts-li">
                        {startPosts && Posts && Posts.map((posts) => (
                            <div key={posts.id} className="Posts-Grid">
                                <li className="Posts-Title" >
                                    <div className="edit">
                                        <button onClick={() => editPosts(posts)} className="button">
                                            <MdEdit size={20}/>
                                        </button>
                                    </div>
                                    <div className="Posts-title-font" onClick={() => intoPosts(posts.id)}>
                                        {posts.title}
                                    </div>
                                </li>
                                <li className="Posts-author">{posts.author}</li>
                                <li className="Posts-Category">{posts.category}</li>

                                <li className="Posts-CommentCount">
                                    <div className="voteScore">
                                        <button onClick={() => this.UpDownVote("upVote", posts.id)} className="button">
                                            <MdArrowDropUp size={15}/>
                                        </button>
                                        <button
                                            onClick={() => this.UpDownVote("downVote", posts.id)}
                                            className="button">
                                            <MdArrowDropDown size={15}/>
                                        </button>
                                    </div>
                                    <p className="Posts-voteScore-font">
                                        {posts.voteScore}
                                    </p>
                                    <button onClick={() => this.delete(posts.id)} className="button">
                                        <MdDelete size={25}/>
                                    </button>
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>

            </div>
        )
    }
};
function mapStateToProps({Category, Posts}) {
    return {Category: Category, Posts: Posts.Posts}
}
function mapDispatchToProps(dispatch) {
    return {
        getCategory: (Category) => dispatch(getAllCategory(Category)),
        getAllPosts: (Posts) => dispatch(getAllPosts(Posts)),
        getCategoryPosts: (Posts) => dispatch(getCategoryPosts(Posts)),
        rankPosts: (Posts) => dispatch(rankPosts(Posts)),
        ControlVote: (id, voteScore) => dispatch(ControlVote(id, voteScore)),
        DeletePosts: (id) => dispatch(DeletePosts(id)),
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Default))
