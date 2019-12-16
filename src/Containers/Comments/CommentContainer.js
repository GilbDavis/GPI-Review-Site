import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import logo from "../../public/images/logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./CommentContainer.css";
import openSocket from 'socket.io-client';

import CommentList from "../../components/CommentBox/CommentList/CommentList";
import CommentForm from "../../components/CommentBox/CommentForm/CommentForm";

class CommentContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      loading: false
    };

    this.addComment = this.addComment.bind(this);
  }

  componentDidMount() {
    // loading
    this.setState({ loading: true });

    // get all the comments
    const postId = this.props.match.params.postId;
    const AuthorizationToken = localStorage.getItem('token');
    fetch("https://review-rest-api.herokuapp.com/comments/all", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + AuthorizationToken
      },
      body: JSON.stringify({ postId: postId })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          comments: res,
          loading: false
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });

    const socket = openSocket('https://review-rest-api.herokuapp.com');
    socket.on('comments', data => {
      if (data.action === 'crear') {
        data.comments.map(comm => {
          return this.addComment(comm);
        });
      }
    });
  }

  /**
   * Add new comment
   * @param {Object} comment
   */
  addComment(comment) {
    this.setState({
      loading: false,
      comments: [comment, ...this.state.comments]
    });
  }

  render() {
    const loadingSpin = this.state.loading ? "App-logo Spin" : "App-logo";
    return (
      <div className="App container bg-light shadow">
        <header className="App-header">
          <img src={logo} className={loadingSpin} alt="logo" />
        </header>

        <div className="row">
          <div className="col-4  pt-3 border-right">
            <h6>Deja tu reseña aqui.</h6>
            <CommentForm addComment={this.addComment} />
          </div>
          <div className="col-8  pt-3 bg-white">
            <CommentList
              loading={this.state.loading}
              comments={this.state.comments}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CommentContainer);