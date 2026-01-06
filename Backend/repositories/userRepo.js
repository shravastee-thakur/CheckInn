import User from "../models/UserModel.js";

export const findByEmail = (email) =>
  User.findOne({ email }).select("+password");

export const findById = (id) => User.findById(id);

export const createUser = (data) => User.create(data);

export const updateUser = (id, update) =>
  User.findByIdAndUpdate(id, update, { new: true });
