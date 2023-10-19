import UserService from "../services";
import logger from "../../util/logger";
import UserModel from "../models/User.model";

//User login

export const loginUser = async (request, response, next) => {
	const { email, password } = request.body;

	if (email && password) {
		await UserService.authenticateUser(email, password)
			.then(async (user) => {
				const authToken = await user.generateAuthToken();
				const data = {
					_id: user._id,
					email: user.email,
					token: authToken,
					permissionLevel: user.permissionLevel,
				};

				request.handleResponse.successRespond(response)(data);
			})
			.catch((error) => {
				const errorResponseData = {
					errorTime: new Date(),
					message: error.message,
				};

				logger.error(JSON.stringify(errorResponseData));
				request.handleResponse.errorRespond(response)(errorResponseData);
				next();
			});
	} else {
		logger.error("Username or Password is missing");
		request.handleResponse.errorRespond(response)("Username or Password is missing");
		next();
	}
};

// User Register
export const registerUser = async (req, res, next) => { 
	if(await UserModel.findOne({email: req.body.email})) {
		req.handleResponse.errorRespond(res)("Email Already Exists");
		next();
	} else {
	
	const user = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		permissionLevel: "USER",
	};

	await UserService.insertUser(user)
		.then((data) => {
			logger.info(`New user with ID ${data._id} created`);
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((error) => {
			logger.error(error.message);
			req.handleResponse.errorRespond(res)(error.message);
			next();
		});
	}
};