import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",

      comment: {
        name: "",
        message: ""
      }
    };

    // bind context to methods
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  componentDidMount() {
    const AuthorizationToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    fetch('https://review-rest-api.herokuapp.com/comments/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + AuthorizationToken
      },
      body: JSON.stringify({ UserId: userId })
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then(data => {
        this.setState(prevState => ({
          comment: {
            ...prevState.message,
            name: `${data.name} ${data.lastName}`
          }
        }))
      })
      .catch(error => {
        this.setState({
          error: error.message(),
          loading: true
        });
      });
  }
  /**
   * Handle form input field changes & update the state
   */
  handleFieldChange = event => {
    const { value, name } = event.target;

    this.setState({
      ...this.state,
      comment: {
        ...this.state.comment,
        [name]: value
      }
    });
  };

  /**
   * Form submit handler
   */
  onSubmit(e) {
    // prevent default form submission
    e.preventDefault();

    if (!this.isFormValid()) {
      this.setState({ error: "All fields are required." });
      return;
    }

    // loading status and clear error
    this.setState({ error: "", loading: true });

    // persist the comments on server
    let { comment } = this.state;
    const userId = localStorage.getItem('userId');
    const postId = this.props.match.params.postId;
    const AuthorizationToken = localStorage.getItem('token');
    fetch("https://review-rest-api.herokuapp.com/comments/add", {
      method: "post",
      headers: {
        Authorization: 'Bearer ' + AuthorizationToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId,
        name: comment.name,
        message: comment.message
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.setState({ loading: false, error: res.error });
        } else {
          // add time return from api and push comment to parent state
          comment.time = res.time;
          this.props.addComment(comment);

          // clear the message box
          this.setState({
            loading: false,
            comment: { ...comment, message: "" }
          });
        }
      })
      .catch(err => {
        this.setState({
          error: "Something went wrong while submitting form.",
          loading: false
        });
      });
  }

  /**
   * Simple validation
   */
  isFormValid() {
    return this.state.comment.name !== "" && this.state.comment.message !== "";
  }

  renderError() {
    return this.state.error ? (
      <div className="alert alert-danger">{this.state.error}</div>
    ) : null;
  }

  render() {
    return (
      <React.Fragment>
        <form method="post" onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              onChange={this.handleFieldChange}
              value={this.state.comment.name}
              className="form-control"
              placeholder="😎 Your Name"
              name="name"
              type="tefxt"
              readOnly
            />
          </div>

          <div className="form-group">
            <textarea
              onChange={this.handleFieldChange}
              value={this.state.comment.message}
              className="form-control"
              placeholder="Su comentario..."
              name="message"
              rows="5"
            />
          </div>

          {this.renderError()}

          <div className="form-group">
            <button className="btn btn-primary">
              Comentar &#10148;
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default withRouter(CommentForm);