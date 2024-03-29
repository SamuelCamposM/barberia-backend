import { PageModel } from "../../models";

export const editarPage = async (item) => {
  try {
    console.log({ item });
    const itemEditado = await PageModel.findOneAndUpdate(
      { _id: item._id },
      item,
      { new: true }
    );
    return { item: itemEditado, error: false };
  } catch (error) {
    return { error: true };
  }
};
