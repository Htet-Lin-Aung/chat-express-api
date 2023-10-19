// utils
import makeValidation from '@withvoid/make-validation';
// models
import UserModel, { USER_TYPES } from '../models/User.js';

export default {
    onGetAllUsers: async (req, res) => {
        try {
          const users = await UserModel.getUsers();
          return res.status(200).json({ success: true, users });
        } catch (error) {
          return res.status(500).json({ success: false, error: error })
        }
      },
    onGetUserById: async (req, res) => {
        try {
          const user = await UserModel.getUserById(req.params.id);
          return res.status(200).json({ success: true, user });
        } catch (error) {
          return res.status(500).json({ success: false, error: error })
        }
      },
    onCreateUser: async (req, res) => {
        try {

            console.log("Request payload:", req.body);
          // Validate the request payload
          const validation = makeValidation(types => ({
            payload: req.body,
            checks: {
              firstName: { type: types.string },
              lastName: { type: types.string },
              type: { type: types.enum, options: { enum: USER_TYPES } },
            }
          }));
      
          if (!validation.success) {
            // Return a 400 Bad Request response with validation errors
            return res.status(400).json(validation);
          }
      
          const { firstName, lastName, type } = req.body;
          // Assuming UserModel.createUser returns a Promise that resolves to the created user
          const user = await UserModel.createUser(firstName, lastName, type);
      
          // Return a 201 Created response with the created user
          return res.status(201).json({ success: true, user });
        } catch (error) {
          // Handle other errors (e.g., database errors)
          return res.status(500).json({ success: false, error: error.message });
        }
      },
      
      onDeleteUserById: async (req, res) => {
        try {
          const user = await UserModel.deleteByUserById(req.params.id);
          return res.status(200).json({ 
            success: true, 
            message: `Deleted a count of ${user.deletedCount} user.` 
          });
        } catch (error) {
          return res.status(500).json({ success: false, error: error })
        }
      },
  }