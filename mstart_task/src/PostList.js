import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [postDetail, setPostDetail] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      setPosts(response.data);
    };

    const fetchUsers = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const usersWithProfileImages = response.data.map((user, index) => ({
        ...user,
        profileImageUrl: `/user_photos/slika${index + 1}.png`
      }));
      setUsers(usersWithProfileImages);
    };

    fetchPosts();
    fetchUsers();
  }, []);

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "";
  };

  const handlePostClick = async (postId) => {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${postId}?_embed=comments`
    );
    const post = response.data;
    const comments = post.comments;
    const user = users.find((user) => user.id === post.userId);

    const postDetail = {
      id: post.id,
      title: post.title,
      body: post.body,
      comments: comments,
      userName: user ? user.name : "",
      userEmail: user ? user.email : "",
      userPhone: user ? user.phone : "",
      userProfileImageUrl: user ? user.profileImageUrl : ""
    };
    setPostDetail(postDetail);
    setShowPostDetailModal(true);
  };

  const renderPostRow = (post) => {
    const userName = getUserNameById(post.userId);
    const userProfileImageUrl = users.find(
      (user) => user.id === post.userId
    ).profileImageUrl;

    return (
      <tr key={post.id} onClick={() => handlePostClick(post.id)}>
        <td>{post.id}</td>
        <td>{post.title}</td>
        <td>{userName}</td>
        <td>
          <img src={userProfileImageUrl} alt={`Profile of ${userName}`} />
        </td>
      </tr>
    );
  };

  const renderPostTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>User</th>
            <th>Profile Image</th>
          </tr>
        </thead>
        <tbody>{posts.map((post) => renderPostRow(post))}</tbody>
      </table>
    );
  };

  const renderPostDetailModal = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setShowPostDetailModal(false)}>
            ×
          </span>
          <h2>{postDetail.title}</h2>
          <p>{postDetail.body}</p>
          <h3>Comments</h3>
          {postDetail.comments.map((comment) => (
            <div key={comment.id} className="comment">
              <h4>{comment.email}</h4>
              <p>{comment.body}</p>
            </div>
          ))}
          <h3>User Information</h3>
          <div className="user-info">
            <div className="user-profile-image">
              <img
                src={postDetail.userProfileImageUrl}
                alt={{ ...postDetail.userName }}
              />
            </div>
            <div className="user-details">
              <p>
                <strong>Name:</strong> {postDetail.userName}
              </p>
              <p>
                <strong>Email:</strong> {postDetail.userEmail}
              </p>
              <p>
                <strong>Phone:</strong> {postDetail.userPhone}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Posts</h1>
      {renderPostTable()}
      {showPostDetailModal && renderPostDetailModal()}
    </div>
  );
};

export default App;
