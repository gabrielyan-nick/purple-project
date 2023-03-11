import User from "../models/User.js";
import Post from "../models/Post.js";

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((friendId) => friendId !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { socialLinks, ...data } = req.body;
    let updatedUser;
    if ("socialLinks" in req.body) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        {
          socialLinks: socialLinks || [],
        },
        { new: true }
      ); // Костыль для удаления всех socialLinks. При удалении единственной ссылки, отправляем [] в formData с фронта, здесь проверяем. Без проверки в socialLinks поместится ''.
    } else {
      updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...data,
        },
        { new: true }
      );
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const changeAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { picturePath } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        picturePath,
      },
      { new: true }
    );
    await Post.updateMany({ userId: id }, { userPicturePath: picturePath });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
