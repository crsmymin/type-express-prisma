import { Request, Response } from "express";
import {
  getAllPosts,
  getPostById,
  createNewPost,
  updatePostById,
  deletePostById,
} from "../services/postService";

interface CustomRequest extends Request {
  user?: { id: number; role: string }; // 사용자 정보에 id가 포함된다고 가정
}

/*
  GET
  - 포스트가 없는 경우 404를 반환합니다.
 */
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPosts();
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found." });
    }
    res.status(200).json(posts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error retrieving posts", error: error.message });
  }
};

/*
  GET:ID
  - 포스트 ID를 받아 해당 포스트를 반환합니다.
  - 포스트가 없는 경우 404를 반환합니다.
 */
export const getPostByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    const post = await getPostById(parseInt(id));

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error retrieving post", error: error.message });
  }
};

/*
  CREATE
  - 제목, 설명, 내용을 받아 새 포스트를 생성합니다.
  - 사용자 ID를 가져와 작성자로 설정합니다.
 */
export const createPost = async (req: CustomRequest, res: Response) => {
  const { title, description, content } = req.body;
  const authorId = req.user?.id;

  if (!authorId) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login first." });
  }

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const newPost = await createNewPost(
      title,
      description || null,
      content,
      authorId
    );
    res.status(201).json(newPost);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

/*
  UPDATE
  - 포스트 ID를 받아 해당 포스트를 업데이트합니다.
  - 작성자 또는 관리자만 업데이트할 수 있습니다.
 */
export const updatePost = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const authorId = req.user?.id;
  const authorRole = req.user?.role;
  const { title, description, content, published } = req.body;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  if (!authorId) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login first." });
  }

  try {
    const currentPost = await getPostById(parseInt(id));

    if (!currentPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isAuthor = currentPost.authorId === authorId;
    const isAdmin = authorRole === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message: "Forbidden. You are not authorized to update this post.",
      });
    }

    if (
      !title &&
      !description &&
      !content &&
      typeof published === "undefined"
    ) {
      return res.status(400).json({ message: "No fields to update." });
    }

    const updatedPost = await updatePostById(
      parseInt(id),
      title || null,
      description || null,
      content || null,
      published
    );

    res.json(updatedPost);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

/*
  DELETE
  - 포스트 ID를 받아 해당 포스트를 삭제합니다.
  - 작성자 또는 관리자만 삭제할 수 있습니다.
 */
export const deletePost = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const authorId = req.user?.id;
  const authorRole = req.user?.role;

  if (!id || isNaN(parseInt(id))) {
    // return res.status(400).json({ message: "Invalid post ID." });
  }

  if (!authorId) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please login first." });
  }

  try {
    const currentPost = await getPostById(parseInt(id));

    if (!currentPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isAuthor = currentPost.authorId === authorId;
    const isAdmin = authorRole === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message: "Forbidden. You are not authorized to delete this post.",
      });
    }

    await deletePostById(parseInt(id));

    res.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
