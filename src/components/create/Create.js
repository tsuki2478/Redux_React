import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import "../Default/defaultCss.css";
import serializeForm from 'form-serialize'
import {Link} from 'react-router-dom'
import {AddPosts,editPosts} from '../../actions';
import * as api from '../../utils/api'

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'none',
            submit: 'none',
            Create: "true",
            title: null,
            body: null,
            id:null
        };
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }
    //添加新帖子
    handleSubmit = (e) => {
        e.preventDefault()
        const values = serializeForm(e.target, {hash: true})
        if (values.title && values.body && values.author && values.category && values.category !== "none") {
            api
                .add(values)
                .then((contacts) => {
                    this.props.AddPosts(contacts)
                    this.props.history.push("/");
                    console.group("添加新帖子。")
                    console.log(contacts)
                    console.groupEnd();
                })
        } else {
            console.log("失败")
            this.setState(() => ({submit: "false"}))
        }
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

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    //修改
    editSubmit = (e) => {
        e.preventDefault();
        const values = serializeForm(e.target, {hash: true})
        console.log(values)
        if(values.body&&values.title){
            api.editCard(this.state.id, values).then((contacts) => {
                this.props.editPosts(contacts.id,contacts.body,contacts.title);
                this.props.history.push("/");
                console.group("编辑现有帖子的详细信息。")
                console.log(contacts);
                console.groupEnd();
            })
        }else {
            console.log("失败")
            this.setState(() => ({submit: "false"}))
        }
    }
    //仅限于修改。。 英文form表单不能填写默认值，也可能是我没设对..换了种方式实现,同步获取其变质，然后提交效果一样
    onchangeTitle = (title) => {
        this.setState({title: title});
    }
    onchangeBody = (body) => {
        this.setState({body: body});
    }

    //进入页面
    componentDidMount() {
        // console.log(this.props.history.location)  //获取跳转链接方式。。打印看下就知道了
        if (this.props.history.location.pathname === "/create") {
            this.setState(() => ({Create: "true"}))
            console.log('添加')
        } else {
            this.setState(() => ({Create: "false", title: this.props.edit.title, body: this.props.edit.body,id:this.props.edit.id}))
            console.log('修改')
        }
    }
    render() {
        const {Category, Posts, edit} = this.props
        const {Create, body, title} = this.state
        console.log('Props', this.props)
        return (
            <div className="App">
                <Link className="close-create-contact" to='/'>Close</Link>
                {Create === "false"
                    ? this.props.edit !== null && <div>
                            <form onSubmit={this.editSubmit} className='create-contact-form'>
                                <div className='create-contact-details'>
                                    <textarea
                                        cols="10"
                                        rows="3"
                                        name='title'
                                        placeholder='title'
                                        value={this.state.title}
                                        onChange={(event) => this.onchangeTitle(event.target.value)}/>
                                    <textarea
                                        cols="10"
                                        rows="3"
                                        className="text"
                                        name='body'
                                        placeholder='body'
                                        value={this.state.body}
                                        onChange={(event) => this.onchangeBody(event.target.value)}/>
                                    <button>edit Contact</button>
                                </div>
                            </form>
                        </div>
                    : <div>
                        <form onSubmit={this.handleSubmit} className='create-contact-form'>
                            <div className='create-contact-details'>
                                <textarea cols="10" rows="3" name='title' placeholder='title'/>
                                <textarea cols="10" rows="3" className="text" name='body' placeholder='body'/>
                                <input type='text' name='author' placeholder='author'/>
                                <input
                                    className="none"
                                    type='hidden'
                                    name='timestamp'
                                    defaultValue={Date.now()}
                                    />
                                <input
                                    className="none"
                                    type='hidden'
                                    name='id'
                                    placeholder='author'
                                    defaultValue={this.genId()}
                                    />

                                <select name='category' value={this.state.value} onChange={this.handleChange}>
                                    <option value="none" disabled>选择类别</option>
                                    {Category.categories && Category
                                        .categories
                                        .map((Category) => (
                                            <option key={Category.path} value={Category.name}>{Category.name}
                                            </option>
                                        ))}
                                </select>
                                <button>Add Contact</button>
                            </div>
                        </form>
                    </div>
}
                {this.state.submit === "false" && <div>
                    您填写的信息不完整，请重新输入
                </div>
}
            </div>
        )
    }
}

function mapStateToProps({Category, Posts}) {
    return {Category: Category, Posts: Posts.Posts}
}
function mapDispatchToProps(dispatch) {
    return {
        AddPosts: (Posts) => dispatch(AddPosts(Posts)),
        editPosts: (id,body,title) => dispatch(editPosts(id,body,title)),
        
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Create))
