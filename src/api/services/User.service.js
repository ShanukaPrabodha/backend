import UserModel from "../models/User.model";


// Authenticate User
export const authenticateUser = async (email, password) => {
	return await UserModel.findOne({ email })
		.then(async (admin) => {
			if (admin && (await admin.matchPassword(password))) {
				return admin;
			} else {
				throw new Error("Invalid Email or Password!");
			}
		})
		.catch((error) => {
			throw new Error(error.message);
		});
};

// Insert User

export const insertUser = async (user) => {
	return await UserModel.create(user)
		.then(async (user) => {
			await user.generateAuthToken();
			return user;
		})
		.catch((error) => {
			throw new Error(error.message);
		});
};