import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPosts = async () => {
  return await prisma.post.findMany();
};

export const getPostById = async (id: number) => {
  return await prisma.post.findUnique({
    where: { id },
  });
};

export const createNewPost = async (
  title: string,
  description: string | null,
  content: string,
  authorId: number
) => {
  return await prisma.post.create({
    data: {
      title,
      description,
      content,
      authorId,
    },
  });
};

export const updatePostById = async (
  id: number,
  title: string,
  description: string | null,
  content: string,
  published: boolean | undefined
) => {
  return await prisma.post.update({
    where: { id },
    data: {
      title,
      description,
      content,
      published,
      updatedAt: new Date(),
    },
  });
};

export const deletePostById = async (id: number) => {
  return await prisma.post.delete({
    where: { id },
  });
};
