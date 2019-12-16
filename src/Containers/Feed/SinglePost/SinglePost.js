import React, { Component } from 'react';
import Image from '../../../components/Image/Image';
import CommentForm from '../../Comments/CommentContainer';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    fetch(`https://review-rest-api.herokuapp.com/feed/post/${postId}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData)
        this.setState({
          title: resData.post.title,
          author: resData.post.creator.name,
          image: `${resData.post.imageUrl}`,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          content: resData.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getPostIdHandler = () => {
    return this.props.match.params.postId;
  }

  render() {
    return (
      <div>
        <section className="single-post">
          <h1>{this.state.title}</h1>
          <h2>
            Creado el {this.state.date}
          </h2>
          <div className="single-post__image">
            <Image contain imageUrl={this.state.image} />
          </div>
          <p>{this.state.content}</p>
        </section>
        <CommentForm />
      </div>
    );
  }
}

export default SinglePost;
