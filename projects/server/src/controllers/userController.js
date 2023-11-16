const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");
const crypto = require("crypto");
const Generate = require("../middleware/webToken");
const Mailer = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const qs = require("qs");

module.exports = {
  /* GET METHOD*/

  getAllProduct: async (req, res) => {
    const lastID = Number(req.query.lastID) || 0;
    const limit = Number(req.query.limit) || 10;

    try {
      let result = [];
      if (lastID < 1) {
        const results = await db.Product.findAll({
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          include: [
            {
              model: db.Category,
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
          ],
          limit: limit,
          order: [["id", "ASC"]],
        });
        result = results;
      } else {
        const results = await db.Product.findAll({
          where: { id: { [Op.lt]: lastID } },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          include: [
            {
              model: db.Category,
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            },
          ],
          limit: limit,
          order: [["id", "ASC"]],
        });
        result = results;
      }
      res.status(200).json({
        ok: true,
        result: result,
        lastID: result.length ? result[result.length - 1].id : 0,
        hasMore: result.length >= limit ? true : false,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  userInformation: async (req, res) => {
    const userData = req.user;

    try {
      const user = await db.User.findOne({
        where: { email: userData.email, username: userData.username },
        include: [
          {
            model: db.Role,
            attributes: { exclude: ["createdAt", "updatedAt", "id"] },
          },
        ],
        attributes: {
          exclude: [
            "password",
            "role_id",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
      });
      return res.status(200).json({
        ok: true,
        message: "user profile",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  getProductDetail: async (req, res) => {
    const { productID } = req.params;
    try {
      const product = await db.Product.findOne({
        where: { id: productID },
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });

      if (!product) {
        return res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }
      res.status(200).json({
        ok: true,
        message: "retrieving product detail successful",
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  getProductPerCategory: async (req, res) => {
    const { categoryID } = req.params;
    try {
      const product = await db.Product.findAll({
        where: { category_id: categoryID },
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });

      if (product.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }

      res.status(200).json({
        ok: true,
        message: "retrieving product per category successful",
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  getProductByName: async (req, res) => {
    const { productName } = req.params;
    try {
      const product = await db.Product.findOne({
        where: { name: productName },
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });

      if (!product) {
        return res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }
      res.status(200).json({
        ok: true,
        message: "retrieving product per category successful",
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },
  /* POST METHOD */

  login: async (req, res) => {
    const { user_identification, password } = req.body;
    try {
      const user = await db.User.findOne({
        where: {
          [Op.or]: [
            { email: user_identification },
            { username: user_identification },
          ],
        },
      });

      if (!user) {
        return res.status(401).json({
          ok: false,
          message: "User not found",
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({
          ok: false,
          message: "Wrong password",
        });
      }
      const access_token = Generate.token(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role_id: user.role_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1h"
      );

      res.json({
        ok: true,
        message: "Log in successful",
        access_token,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  registerAndLoginByGmail: async (req, res) => {
    const {
      role_id = 2,
      username,
      email,
      phone,
      image_profile = "/image-profile/imageProfileDefault.png",
      is_active = false,
      by_form = false,
    } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const cryptoPassword =
        crypto.randomBytes(16).toString("hex") +
        Math.random() +
        "-" +
        new Date().getTime();

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(cryptoPassword, salt);

      const [user, create] = await db.User.findOrCreate({
        where: { email },
        defaults: {
          role_id,
          username,
          email,
          phone,
          image_profile,
          is_active,
          by_form,
          password: hashPassword,
        },
        transaction,
      });

      if (!create) {
        const access_token = Generate.token(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role_id: user.role_id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          "1h"
        );
        return res.status(200).json({
          ok: true,
          message: "login successful",
          access_token,
        });
      }

      const message =
        "Welcome to B•U! We're excited to have you with us. Explore our wide range of products and enjoy a seamless shopping experience. If you need any help, don't hesitate to reach out !";
      const mailing = {
        recipient_email: email,
        subject: "Register Successful",
        receiver: username,
        message,
      };
      await transaction.commit();
      Mailer.sendEmail(mailing)
        .then((response) =>
          res.status(201).json({
            ok: true,
            message: `${response.message}, registration ${username} successful `,
          })
        )
        .catch((error) =>
          res
            .status(400)
            .json({ ok: false, message: error.message, error: error.message })
        );
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  registerByForm: async (req, res) => {
    const {
      role_id = 2,
      username,
      email,
      phone,
      image_profile = "/image-profile/imageProfileDefault.png",
      is_active = false,
      by_form = true,
      password,
      confirm_password,
    } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      if (password !== confirm_password) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "Password and confirm password have to match",
        });
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const isEmailExist = await db.User.findOne({
        where: { email },
      });

      const isUsernameExist = await db.User.findOne({
        where: { username },
      });

      if (isEmailExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "Email already used",
        });
      }

      if (isUsernameExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "username already used",
        });
      }

      const newUser = await db.User.create(
        {
          role_id,
          username,
          email,
          phone,
          image_profile,
          is_active,
          by_form,
          password: hashPassword,
        },
        { transaction }
      );

      const message =
        "Welcome to B•U! We're excited to have you with us. Explore our wide range of products and enjoy a seamless shopping experience. If you need any help, don't hesitate to reach out ! Please, waiting activation approval from our admin";
      const mailing = {
        recipient_email: email,
        subject: "Register Successful",
        receiver: newUser.username,
        message,
      };
      await transaction.commit();
      Mailer.sendEmail(mailing)
        .then((response) =>
          res.status(201).json({
            ok: true,
            message: `${response.message}, registration ${username} successful `,
          })
        )
        .catch((error) =>
          res
            .status(400)
            .json({ ok: false, message: error.message, error: error.message })
        );
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  /* PATHC METHOD */
  editProfile: async (req, res) => {
    const userData = req.user;
    const {
      username,
      phone,
      is_active,
      password,
      new_password,
      new_confirm_password,
    } = req.body;
    const transaction = await db.sequelize.transaction();

    try {
      const image = req.file?.filename;

      const user = await db.User.findOne({ where: { id: userData.id } });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "User not found",
        });
      }

      if (username) {
        const isUsernameExist = await db.User.findOne({
          where: { username: username },
        });
        if (isUsernameExist) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Username already taken",
          });
        }

        await db.User.update(
          { username: username },
          { where: { id: user.id }, transaction }
        );

        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change username successful",
        });
      }

      if (new_password && new_confirm_password) {
        if (new_password !== new_confirm_password) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Password and confirm password have to match",
          });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Wrong password",
          });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(new_password, salt);

        await db.User.update(
          { password: hashPassword },
          { where: { id: user.id }, transaction }
        );

        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change password successful",
        });
      }

      if (phone) {
        const isPhoneExist = await db.User.findOne({
          where: { phone },
        });

        if (isPhoneExist) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Phone number already taken",
          });
        }

        await db.User.update(
          { phone: phone },
          { where: { id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change phone successful",
        });
      }

      if (image) {
        const userDetail = await db.User.findOne({
          where: { id: user.id },
        });

        if (!userDetail) {
          await transaction.rollback();
          res.status(401).json({
            ok: false,
            message: "User data not found",
          });
        }

        const previousImageName = userDetail
          .getDataValue("image_profile")
          ?.split("/")[2];

        if (!previousImageName) {
          await db.User.update(
            {
              image_profile: `/image-profile/${image}`,
            },
            { where: { id: user.id }, transaction }
          );
        }

        if (previousImageName) {
          if (previousImageName === "imageProfileDefault.png") {
            await db.User.update(
              {
                image_profile: `/image-profile/${image}`,
              },
              { where: { id: user.id }, transaction }
            );
          }
          const imagePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "server",
            "src",
            "public",
            "imageProfile",
            previousImageName
          );
          if (previousImageName !== "imageProfileDefault.png") {
            fs.unlinkSync(imagePath);
            await db.User.update(
              {
                image_profile: `/image-profile/${image}`,
              },
              { where: { id: user.id }, transaction }
            );
          }
          await db.User.update(
            {
              image_profile: `/image-profile/${image}`,
            },
            { where: { id: user.id }, transaction }
          );
        }
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change photo profile successful",
        });
      }

      if (is_active !== null || is_active !== undefined || is_active !== "") {
        await db.User.update(
          { is_active },
          { where: { id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change phone successful",
        });
      }

      return res.json({
        ok: true,
        message: "You did not update anything",
        data: {
          username,
          phone,
          password,
          new_password,
          new_confirm_password,
        },
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  /* DELETE METHOD */
};
