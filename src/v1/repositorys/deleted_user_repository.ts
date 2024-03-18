import { CustomHttpErrorModel } from "../../models/custom_http_error_model";
import { DeletedUser, DeletedUserModel } from "../models/deleted_user_model";

/**
 * @DESC create new DeletedUser
 * mongoDB에 새로운 Deleteduser를 생성함
 */
export const addDeletedUser = async (user: DeletedUser) => {
  try {
    const savedUser = await DeletedUserModel.create(user);
    return savedUser;
  } catch (error: any) {
    throw error;
  }
};
