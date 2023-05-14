import { Request, Response, Router } from "express";
import { isValidObjectId } from "mongoose";
import { DataUtils } from "../utils/default_util";
export const diaryRouter = Router();

// blogRouter.use("/:blogId/comment", commentRouter);

diaryRouter.post("/", async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    // if (typeof title !== "string")
    //   return res.status(400).send({ err: "title is required" });
    // if (typeof content !== "string")
    //   return res.status(400).send({ err: "content is required" });
    // if (islive && typeof islive !== "boolean")
    //   return res.status(400).send({ err: "islive must be a boolean" });

    // if (!isValidObjectId(userId))
    //   return res.send(400).send({ err: "userId is invalid" });

    // let user = await User.findById(userId);
    // if (!user) return res.status(400).send({ err: "user does not exist" });

    // // let blog = new Blog({ ...req.body, user: user._id });
    // // 아래와 같이 넣어주더라도 user객체를 모두 넣는거는 아님 ID만 넣어주 ㅋㅋ
    // let blog = new Blog({ ...req.body, user: user });
    // await blog.save();
    return res.send({ a: "sdfsdf" });
  } catch (error: any) {
    DataUtils.errorHandle({
      error: error,
      res: res,
    });
  }
});

// diaryRouter.get("/", async (req, res) => {
//   try {
//     let { page } = req.query;
//     page = parseInt(page);
//     console.log(page);
//     const blogs = await Blog.find({})
//       .sort({ updatedAt: -1 })
//       .skip(page * 3)
//       .limit(3);
//     // 이거 시발 좋다 이새끼
//     // foreign으로서 물려있는 애들 종합해서 한번에 불러오기
//     // .populate([
//     //   { path: "user" },
//     //   { path: "comment", populate: { path: "user" } },
//     // ]);

//     res.send({ blogs });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ err: error.message });
//   }
// });

// blogRouter.get("/:blogId", async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     if (!isValidObjectId(blogId))
//       res.send(400).send({ err: "blogId is invalid" });

//     const blog = await Blog.findOne({ _id: blogId });
//     // const commentCount = await Comment.find({ blog: blogId }).countDocuments();
//     return res.send({ blog, commentCount });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ err: error.message });
//   }
// });

// blogRouter.put("/:blogId", async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     if (!isValidObjectId(blogId))
//       res.send(400).send({ err: "blogId is invalid" });
//     const { title, content } = req.body;

//     if (typeof title !== "string")
//       res.status(400).send({ err: "title is required" });
//     if (typeof content !== "string")
//       res.status(400).send({ err: "content is required" });

//     const blog = await Blog.findOneAndUpdate(
//       { _id: blogId },
//       { title, content },
//       { new: true }
//     );
//     return res.send(blog);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ err: error.message });
//   }
// });

// //부분적 수정
// blogRouter.patch("/:blogId/live", async (req, res) => {
//   try {
//     const { blogId } = req.params;
//     if (!isValidObjectId(blogId))
//       res.send(400).send({ err: "blogId is invalid" });
//     const { islive } = req.body;
//     if (typeof islive !== "boolean")
//       res.status(400).send({ err: "boolean islive is required" });

//     const blog = await Blog.findByIdAndUpdate(
//       blogId,
//       { islive },
//       { new: true }
//     );
//     return res.send({ blog });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ err: error.message });
//   }
// });
