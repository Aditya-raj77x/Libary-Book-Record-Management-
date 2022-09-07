const express = require("express");
const { getAllUsers, getSingleUserById, deleteUser, updateUserInfo, createNewUser, getSubcriptionDetailsById } = require("../controller/user.controler");





const router = express.Router();

// all the routes

/**
 * Route:users
 * method:GET
 * Descripstion:getting all users
 * Access:public
 * Parameters:None
 */
router.get("/", getAllUsers);

/**
 * Route:users/:id
 * method:GET
 * Descripstion:getting single users bu id
 * Access:public
 * Parameters: id
 */

router.get("/:id", getSingleUserById);

/**
 * Route:users
 * method:Post
 * Descripstion:create new user
 * Access:public
 * Parameters: None
 */

router.post("/",createNewUser);

/**
 * Route:users/:id
 * method:Put
 * Descripstion:updating user   info
 * Access:public
 * Parameters: id
 */
router.put("/:id", updateUserInfo);
/**
 * Route:users/:id
 * method:Put
 * Descripstion:delete a user by id
 * Access:public
 * Parameters: id
 */
router.delete("/:id", deleteUser);

/**
 * Route:users/subdetails/:id
 * method:GET
 * Descripstion:get all user subscripstion detail
 * Access:public
 * Parameters: id
 */
router.get("/subdetails/:id",getSubcriptionDetailsById)

module.exports = router;
