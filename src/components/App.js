import './App.css';
import React, {Component} from 'react';
import Default from './Default/Default';
import {connect} from 'react-redux';
import {BrowserRouter as Link, Route,withRouter} from "react-router-dom";
import * as api from '../utils/api'
import  CategoryPage from "./category/CategoryPage";
import {getCategoryPosts,getPosts} from '../actions'
import Create from "./create/Create";
import PostDetail from "./PostDetail/PostDetail";
class App extends Component {
  // import PropTypes from "prop-types";
  //新玩法跳转，尽量就别用吧
  // static contextTypes = {
  // router: PropTypes.object
  // }
  // this.context.router.history.push("/");
  state = {
    Selected: "none",
    editPosts: null,
}
    //获取单独类别的全部帖子
   searchCategory = (event) => {
      console.log(event.target.value);
      let Selected = event.target.value;
      if (Selected === "none") {
        this.setState(() => ({ Selected: Selected}))
          this.props.history.push("/");
      } else {
          api.category(Selected).then((contacts) => {
                  this.props.getCategoryPosts(contacts);
                  console.log(Selected)
                  this.setState(() => ({ Selected: Selected}))
                  this.props.history.push("/category");
                  console.group("获取特定类别的所有帖子。")
                  console.log(contacts);
                  console.groupEnd();
            })
      }
  }
   
  editPosts= (Posts)=> {
    this.setState(() => ({ editPosts: Posts}))
    this.props.history.push("/create/${Posts.id}");
  }
     //进入帖子
     intoPosts=(id)=> {
     this.props.getPosts(id);
      this.props.history.push("/postDetail");
  }

  render() {
    return (
      <div className="app">

        <Route exact path="/" render={() => (
          <Default
          SearchCategory={this.searchCategory}
          Selected={this.state.Selected}
          editPosts={this.editPosts}
          intoPosts={this.intoPosts}
          />
        )}/>

        <Route path="/category" render={({history}) => (
          <CategoryPage
          SearchCategory={this.searchCategory}
          Selected={this.state.Selected}
          editPosts={this.editPosts}
          intoPosts={this.intoPosts}
          />
        )}/>

        <Route path="/create" render={({history}) => (
          <Create
          edit={this.state.editPosts}
          />
        )}/>
        <Route path="/postDetail" render={({history}) => (
          <PostDetail
          editPosts={this.editPosts}
          />
        )}/>
      </div>
    )
  }
}

function mapStateToProps({Category, Posts}) {
  return {Category: Category, Posts: Posts}
}
function mapDispatchToProps(dispatch) {
  return {
      getCategoryPosts: (Posts) => dispatch(getCategoryPosts(Posts)),
      getPosts: (id) => dispatch(getPosts(id)),
      
  }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App))

