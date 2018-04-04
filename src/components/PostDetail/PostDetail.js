import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router-dom';
import "../Default/defaultCss.css";
import moment from 'moment';
import * as api from '../../utils/api'
import {getAllVote, rankVote, ControlVote, AddVote,
    ControlThumb,DeleteVote,EditVote
} from '../../actions'
import MdEdit from "react-icons/lib/md/edit";
import * as _ from 'lodash';
import MdAddCircle from "react-icons/lib/md/add-circle";
import MdArrowDropUp from "react-icons/lib/md/arrow-drop-up";
import MdArrowDropDown from "react-icons/lib/md/arrow-drop-down";
// import Loading from 'react-loading'
import Modal from 'react-modal'
import serializeForm from 'form-serialize'
import MdDelete from "react-icons/lib/md/delete";

class PostDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp: null,
            AddModalOpen: false,
            EditModalOpen: false,
            // loading: false,
            submit: 'none',
            parentId: null,
            body:null,
            voteId:null
        };
    }

    componentDidMount() {
        // 时间格式化 其实可以在reduser里写
        if (this.props.Posts.Posts) {
            let Posts = moment(this.props.Posts.Posts.timestamp).format("YYYY-MM-DD HH:mm:ss");
            this
                .props
                .Posts
                .Posts
                .map((posts) => {
                    posts.timestamp = Posts;
                    this.setState(() => ({timestamp: posts.timestamp, parentId: posts.id}));
                    api
                        .getVote(posts.id)
                        .then((contacts) => {
                            this
                                .props
                                .getAllVote(contacts);
                            console.group("获取单个帖子的所有评论。")
                            console.log(contacts);
                            console.groupEnd();
                        })
                })
        };
    };

    // loading动画 ，没用上! 通过true和false来触发，每次执行都会重新渲染..
    //如进入方法改成ture触发，当接口查询完毕拿到数据时，再改成false关掉动画
      loading(){
        this.setState(() => ({loading: true}))
        this.setState(() => ({loading: false})) 
      }
    //排序
    handleChange(event, Vote) {
        console.log(event.target.value)
        console.log(Vote)
        Vote = _.sortBy(Vote, [function (o) {
                return o.voteScore;
            }
        ])
        this
            .props
            .rankVote(Vote)
    }
    //帖子点赞
    UpDownVote(event, id) {
        console.log(event)
        console.log(id)
        if (event && id) {
            api.addVote(id, event).then((contacts) => {
                    this.props.ControlVote(contacts.id, contacts.voteScore);
                    console.group("用于对帖子进行投票")
                    console.log(contacts.voteScore + "-------" + contacts.id);
                    console.groupEnd();
                })

        } else {
            console.log("点击失效")
        }
    }
    //给评论点赞
    thumbUp(event,id) { 
        console.log(event)
        console.log(id)
        if (event && id) {
            api.addCommentVote(id, event).then((contacts) => {
                this.props.ControlThumb(contacts.id,contacts.voteScore);
                console.group("用于对评论进行投票。")
                console.log(contacts);
                console.groupEnd();
            })
        } else {
            console.log("点击失效")
        }
    }
 
    //创建评论
    openModal = () => {
        this.setState(() => ({AddModalOpen: true}))
    }
    //关闭模态框
    closeModal = () => {
        this.setState(() => ({
            AddModalOpen: false, EditModalOpen: false,body:null,voteId:null,submit:"none"
        }))
    };
    //防止模态框GG
    componentWillMount() {
        Modal.setAppElement('body');
    }
    //随机生成uuid， xxx可以设置位数
    genId() {
        return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x'
                    ? r
                    : (r && 0x3 || 0x8);
            return v.toString(16);
        }).toUpperCase();
    }

    //添加新评论
    handleSubmit = (e) => {
        e.preventDefault()
      
        const values = serializeForm(e.target, {hash: true})
        if (values.body && values.author) {
            api
                .addComment(values)
                .then((contacts) => {
                    this.props.AddVote(values);
                    this.closeModal();
                    console.group("在帖子中添加评论。")
                    console.log(contacts)
                    console.groupEnd();
                })
        } else {
            console.log("添加失败")
            this.setState(() => ({submit: 'false'}))
        }
    }
  editComment = {
        timestamp:Date.now(),
        body:"edit body"
    }
    //修改
    editSubmit = (e) => {
        e.preventDefault();
        const values = serializeForm(e.target, {hash: true})
        if (values&&this.state.voteId) {
        api.editComments(this.state.voteId,values).then((contacts) => {
            this.props.EditVote(contacts.id,contacts.body);
            this.closeModal();
            console.group("编辑现有评论的详细信息。")
            console.log(contacts);
            console.groupEnd();
            })            
        } else {
            console.log("失败")
            this.setState(() => ({submit: "false"}))
        }
    }
    //修改modal的方式
    editModal=(body,id)=>{
        this.setState(() => ({AddModalOpen: true, EditModalOpen:true,body:body,voteId:id}))
    }
    // 删除
    delete(id) {
        console.log('删除')
        if(id) {
            api.DeleteComment(id).then((contacts) => {
            this.props.DeleteVote(id);
            console.group("将评论的已删除标志设置为true。")
            console.log(contacts);
            console.groupEnd();
            })
        }else {
            console.log("删除失败")
        }
    }
    //修改评论使用.. 同步body属性
    onchangeBody = (body) => {
        this.setState({body: body});
    }

    render() {
        const {Posts, editPosts, } = this.props
        const {
            AddModalOpen,
            EditModalOpen,
            parentId,
            submit,
        } = this.state
        // console.log('state', this.props) console.log('props', this.state)
        return (
            <div className="App">
                <Link className="close-create-contact" to='/'>Close</Link>
                <div>
                    {Posts.Posts && Posts
                        .Posts
                        .map((posts) => (
                            <div className="Posts-content" key={posts.id}>
                                <p className="PostDetail-title">
                                    <button onClick={() => editPosts(posts)} className="button">
                                        <MdEdit size={15}/>
                                    </button>
                                    {posts.title}
                                </p>
                                <p className="PostDetail-body">
                                    {posts.body}
                                </p>

                                <ul className="PostDetail-ul">
                                    <li className="PostDetail-li">
                                        <p className="PostDetail-p1">
                                            {posts.author}
                                        </p>
                                        <p className="PostDetail-p">作者</p>
                                    </li>

                                    <li className="PostDetail-li">
                                        <p className="PostDetail-p1">
                                            {posts.category}
                                        </p>
                                        <p className="PostDetail-p">分类</p>
                                    </li>

                                    <li className="PostDetail-li">
                                        <p className="PostDetail-p1">
                                            {posts.timestamp}
                                        </p>
                                        <p className="PostDetail-p">时间</p>
                                    </li>

                                    <li className="PostDetail-li">

                                        <p className="PostDetail-p1">
                                            {posts.voteScore}
                                        </p>

                                        <p className="PostDetail-p">
                                            <button onClick={() => this.UpDownVote("upVote", posts.id)} className="button">
                                                <MdArrowDropUp size={15}/>
                                            </button>
                                            点赞
                                            <button
                                                onClick={() => this.UpDownVote("downVote", posts.id)}
                                                className="button">
                                                <MdArrowDropDown size={15}/>
                                            </button>
                                        </p>
                                    </li>
                                    <li className="PostDetail-li">
                                        <p className="PostDetail-p1">
                                            <select
                                                value="none"
                                                onChange={(event) => this.handleChange(event, this.props.Vote.Vote)}>
                                                <option value="none" disabled>排序</option>
                                                <option value="voteScore">点赞量排序</option>
                                            </select>
                                        </p>
                                        <p className="PostDetail-p">评论排序</p>
                                    </li>
                                </ul>
                            </div>
                        ))}
                </div>

                <div >
                    {this.props.Vote.Vote && this.props.Vote.Vote.map((vote) => (
                            <div className="Vote-All" key={vote.id}>
                                <div className="Vote-content" >
                                    {vote.body}
                                </div>
                                <ul className="Vote-ul">
                                    <li className="Vote-li">
                                        <p className="PostDetail-p">
                                            <button onClick={() => this.thumbUp("upVote", vote.id)} className="button">
                                                <MdArrowDropUp size={45}  color={"pink"}/>
                                            </button>
                                            <span className="vote-li-voteScore">
                                            {vote.voteScore}
                                            </span>
                                            <button onClick={() => this.thumbUp("downVote", vote.id)} className="button">
                                                <MdArrowDropDown size={45} color={"pink"}/>
                                            </button>
                                        </p>
                                    </li>
                                    <li className="Vote-li">
                                    <p className="PostDetail-p">
                                            <button onClick={() => this.editModal(vote.body,vote.id)} className="button">
                                                <MdEdit size={30}     color={"burlywood"}  />
                                            </button>
                                            </p>
                                    </li>
                                    <li className="Vote-li">
                                        <p className="PostDetail-p">
                                            <button onClick={() => this.delete(vote.id)} className="button">
                                                <MdDelete size={30}  color={"burlywood"}/>
                                            </button>
                                        </p>
                                    </li>
                                </ul>

                            </div>
                        ))}
                </div>

                <div className="add" onClick={() => this.openModal()}>
                    <MdAddCircle size={50}/>
                </div>

                <Modal
                    className='modal'
                    overlayClassName='overlay'
                    isOpen={AddModalOpen}
                    onRequestClose={this.closeModal}
                    contentLabel='Modal'
                    style={{
                    content: {
                        color: 'lightsteelblue',
                        background: 'antiquewhite'
                    }
                }}>
                    <div>
                        <div className="close-create-contact" onClick={() => this.closeModal()}>Close</div>
                        {EditModalOpen === true
                            ? <div>
                                    <form onSubmit={this.editSubmit} className='create-contact-form'>
                                        <div className='create-contact-details'>
                                            <textarea
                                                cols="50"
                                                rows="3"
                                                className="text"
                                                name='body'
                                                placeholder='body'
                                                value={this.state.body}
                                                onChange={(event) => this.onchangeBody(event.target.value)}/>
                                        <input className="none" type='hidden' name='timestamp' defaultValue={Date.now()}/>
                                            <button>edit Contact</button>
                                        </div>
                                    </form>
                                </div>
                            : <div>
                                <form onSubmit={this.handleSubmit} className='create-contact-form'>
                                    <div className='create-contact-details'>
                                        <textarea cols="10" rows="3" className="text" name='body' placeholder='body'/>
                                        <input type='text' name='author' placeholder='author'/>
                                        <input className="none" type='hidden' name='timestamp' defaultValue={Date.now()}/>
                                        <input
                                            className="none"
                                            type='hidden'
                                            name='id'
                                            placeholder='author'
                                            defaultValue={this.genId()}/>
                                        <input
                                            className="none"
                                            type='hidden'
                                            name='parentId'
                                            placeholder='author'
                                            defaultValue={parentId}/>
                                        <button>Add Contact</button>
                                    </div>
                                </form>
                            </div>
}
                        {submit === "false" && <div>
                            您填写的信息不完整，请重新输入
                        </div>
}
                    </div>
                </Modal>
            </div>
        )
    }
};
function mapStateToProps({Category, Posts, Vote}) {
    return {Category: Category, Posts: Posts, Vote: Vote}
}
function mapDispatchToProps(dispatch) {
    return {
        ControlVote: (id, voteScore) => dispatch(ControlVote(id, voteScore)),
        getAllVote: (Vote) => dispatch(getAllVote(Vote)),
        rankVote: (Vote) => dispatch(rankVote(Vote)),
        AddVote: (Vote) => dispatch(AddVote(Vote)),
        ControlThumb: (id,voteScore) => dispatch(ControlThumb(id,voteScore)),
        DeleteVote: (id) => dispatch(DeleteVote(id)),
        EditVote: (id,body) => dispatch(EditVote(id,body)),
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostDetail))