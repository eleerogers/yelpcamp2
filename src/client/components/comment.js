import React, { useContext } from 'react';
import moment from 'moment-mini';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import DeleteModal from './deleteModal';
import StarRating from './starRating';


function Comment({
  comment, deleteComment, campground
}) {
  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext);
  const {
    id: campgroundId,
  } = campground;

  function renderCommentButtons(commentObj) {
    const loggedInAsIdInteger = parseInt(loggedInAsId, 10);
    const commentUserId = parseInt(commentObj.user_id, 10);
    if (
      loggedInAsIdInteger === commentUserId
      || loggedInAsAdmin
    ) {
      return (
        <div className="float-right">
          <Link to={{
            pathname: `/campgrounds/${campgroundId}/comments/edit`,
            state: {
              commentObj,
              campground,
              loggedInAsAdmin
            }
          }}
          >
            <Button
              size="sm"
              variant="warning"
              className="mr-2"
            >
              Edit
            </Button>
          </Link>
          <DeleteModal
            itemType="comment"
            itemObj={commentObj}
            handleDelete={deleteComment}
            loggedInAsAdminBool={loggedInAsAdmin}
          >
            Delete
          </DeleteModal>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="col-md-12 mb-2" key={comment.comment_id}>
      <div className="card">
        <div className="card-body">
          {comment.rating && <div>
            <StarRating
              currRating={comment.rating.toString()}
              readonly={true}
              className="star-sm"
            />
          </div>}
          <p className="card-title">
            <Link className="text-primary" to={`/ycusers/${comment.user_id}`}>
              <strong>
                {comment.username}
              </strong>
            </Link>
            <span className="float-right">
              {moment(comment.created_at).fromNow()}
            </span>
          </p>
          <p className="card-text float-left keepTextSpacing">{comment.comment}</p>
          <div className="float-right">
            {renderCommentButtons(comment)}
          </div>
        </div>
      </div>
    </div>
  );
}

Comment.propTypes = {
  campground: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  comment: PropTypes.shape({
    comment_id: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    rating: PropTypes.number
  }).isRequired,
  deleteComment: PropTypes.func.isRequired
};

export default Comment;
