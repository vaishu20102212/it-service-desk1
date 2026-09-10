import type { Comment } from "../../types/comment";

interface CommentListProps {
  comments: Comment[];
}

const CommentList = ({
  comments,
}: CommentListProps) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-800">
              User ID: {comment.userId}
            </p>

            <span className="text-xs text-gray-500">
              {comment.createdDate} {comment.createdTime}
            </span>
          </div>

          <p className="mt-2 text-gray-600">
            {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;