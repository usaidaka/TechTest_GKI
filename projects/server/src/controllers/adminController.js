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
  /* Get METHOD */
  getAllUser: async (req, res) => {
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 2,

      filterRole: Number(req.query.role) || 2,
    };

    try {
      const { count, rows } = await db.User.findAndCountAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: db.Role,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        where: {
          role_id: pagination.filterRole,
        },
        paranoid: false,
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
      });

      if (rows.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "data not found",
        });
      }

      const totalPage = Math.ceil(count / pagination.perPage);

      if (pagination.page > totalPage) {
        return res.status(404).json({
          ok: false,
          message: "page number exceeded the limit page",
        });
      }

      res.status(200).json({
        ok: true,
        message: "retrieving user list successful",
        pagination: {
          ...pagination,
          totalPages: totalPage,
        },
        count,
        rows,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  getAllProductParanoid: async (req, res) => {
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: Number(req.query.perPage) || 2,
    };

    try {
      const { count, rows } = await db.Product.findAndCountAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: {
          model: db.Category,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        paranoid: false,
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
      });

      if (rows.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "data not found",
        });
      }
      const totalPage = Math.ceil(count / pagination.perPage);

      if (pagination.page > totalPage) {
        return res.status(404).json({
          ok: false,
          message: "page number exceeded the limit page",
        });
      }

      const get10NewestProduct = await db.Product.findAll({
        attributes: { exclude: ["updatedAt", "deletedAt"] },
        include: {
          model: db.Category,
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        },
        limit: 10,
        order: [["id", "DESC"]],
      });

      res.status(200).json({
        ok: true,
        message: "retrieving user list successful",
        pagination: {
          ...pagination,
          totalPages: totalPage,
          count,
        },
        rows,
        NewestProduct: get10NewestProduct,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  getAllCategory: async (req, res) => {
    try {
      const category = await db.Category.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });
      res.json({
        ok: true,
        message: "retrieving category successful",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  reportDashboard: async (req, res) => {
    try {
      const userActive = await db.User.findAndCountAll({
        where: { is_active: true },
      });
      const user = await db.User.findAll({});
      const productActive = await db.User.findAll({
        where: { is_active: true },
      });
      const product = await db.User.findAll({});
      res.json({
        ok: true,
        message: "retrieving report dashboard",
        data: {
          userActive: userActive.length ? userActive.length : 0,
          user: user.length ? user.length : 0,
          productActive: productActive.length ? productActive.length : 0,
          product: product.length ? product.length : 0,
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

  getUserByID: async (req, res) => {
    const { userID } = req.params;
    try {
      const user = await db.User.findOne({
        where: { id: userID },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
        },
      });

      if (!user) {
        return res.status(404).json({
          ok: false,
          message: " user not found",
        });
      }

      res.json({
        ok: true,
        message: "retrieving user by id successful",
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
  /* POST METHOD */

  addUser: async (req, res) => {
    const {
      role_id = 2,
      username,
      email,
      phone,
      image_profile = "/image-profile/imageProfileDefault.png",
      is_active = true,
      by_form = true,
      password,
      confirm_password,
    } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const image = req.file?.filename;

      if (!image) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "image profile is require",
        });
      }

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

      const message = `Welcome to B•U! We're excited to have you with us. Explore our wide range of products and enjoy a seamless shopping experience. If you need any help, don't hesitate to reach out ! KEEP IT SECRET: Your Password is ${password}`;
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

  createProduct: async (req, res) => {
    const {
      name,
      price,
      category_id,
      description,
      is_active = true,
    } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const image = req.file?.filename;

      if (!image) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "image product is required",
        });
      }

      const product = await db.Product.findOne({
        where: { name },
      });

      if (product) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "product name already taken",
        });
      }

      const newProduct = await db.Product.create(
        {
          name,
          price: Number(price),
          category_id: Number(category_id),
          description,
          image_product: `${image ? `/image-product/${image}` : null}`,
          is_active,
        },
        transaction
      );

      await transaction.commit();
      return res.status(201).json({
        ok: true,
        message: "Create product successful",
        data: newProduct,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  createCategory: async (req, res) => {
    const { name } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const image = req.file?.filename;

      if (!image) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "image category is required",
        });
      }

      const category = await db.Category.findOne({
        where: { name },
      });

      if (category) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "category name already taken",
        });
      }

      const newCategory = await db.Category.create(
        {
          name,
          image_category: `${image ? `/image-category/${image}` : null}`,
        },
        transaction
      );
      await transaction.commit();
      return res.status(201).json({
        ok: true,
        message: "Create category successful",
        data: newCategory,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },
  /* PATCH METHOD */

  editUser: async (req, res) => {
    const { userID } = req.params;
    const { username, email, phone, is_active, password } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const image = req.file?.filename;
      const user = await db.User.findOne({
        where: { id: userID },
      });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "user not found",
        });
      }

      const userDetail = await db.User.findOne({
        where: { id: userID },
      });

      if (!userDetail) {
        await transaction.rollback();
        res.status(401).json({
          ok: false,
          message: "User data not found",
        });
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const previousImageName = userDetail
        .getDataValue("image_profile")
        ?.split("/")[2];

      if (!previousImageName) {
        await db.User.update(
          {
            username,
            email,
            phone,
            image_profile: `/image-profile/${image}`,
            is_active,
            password: hashPassword,
          },
          { where: { id: userID } },
          transaction
        );
      }

      if (previousImageName) {
        if (previousImageName === "imageProfileDefault.png") {
          await db.User.update(
            {
              username,
              email,
              phone,
              image_profile: `/image-profile/${image}`,
              is_active,
              password: hashPassword,
            },
            { where: { id: userID } },
            transaction
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
              username,
              email,
              phone,
              image_profile: `/image-profile/${image}`,
              is_active,
              password: hashPassword,
            },
            { where: { id: userID } },
            transaction
          );
        }
        await db.User.update(
          {
            username,
            email,
            phone,
            image_profile: `/image-profile/${image}`,
            is_active,
            password: hashPassword,
          },
          { where: { id: userID } },
          transaction
        );
      }

      await db.User.update(
        {
          username,
          email,
          phone,
          image_profile: `/image-profile/${image}`,
          is_active,
          password: hashPassword,
        },
        { where: { id: userID } },
        transaction
      );

      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "edit user successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  editProduct: async (req, res) => {
    const { productID } = req.params;
    const { name, price, category_id, description, is_active } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const image = req.file?.filename;
      const product = await db.Product.findOne({
        where: { id: productID },
      });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }

      const previousImageName = product
        .getDataValue("image_product")
        ?.split("/")[2];
      console.log("edit product", previousImageName);

      if (!previousImageName) {
        await db.Product.update(
          {
            name,
            price: Number(price),
            category_id: Number(category_id),
            description,
            image_product: `/image-product/${image}`,
            is_active,
          },
          { where: { id: productID } },
          transaction
        );
      }

      if (previousImageName) {
        const imagePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "server",
          "src",
          "public",
          "imageProduct",
          previousImageName
        );

        fs.unlinkSync(imagePath);
        await db.Product.update(
          {
            name,
            price: Number(price),
            category_id: Number(category_id),
            description,
            image_product: `/image-product/${image}`,
            is_active,
          },
          { where: { id: productID } },
          transaction
        );
      }

      await db.Product.update(
        {
          name,
          price: Number(price),
          category_id: Number(category_id),
          description,
          image_product: `/image-product/${image}`,
          is_active,
        },
        { where: { id: productID } },
        transaction
      );

      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "edit product successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  editCategory: async (req, res) => {
    const { name } = req.body;
    const { categoryID } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const image = req.file?.filename;
      const category = await db.Category.findOne({
        where: { id: categoryID },
      });
      if (!category) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "category not found",
        });
      }
      if (image) {
        const previousImageName = category
          .getDataValue("image_category")
          ?.split("/")[2];
        console.log("edit category", previousImageName);

        if (!previousImageName) {
          await db.Category.update(
            {
              image_category: `/image-category/${image}`,
            },
            { where: { id: categoryID }, transaction }
          );
        }

        if (previousImageName) {
          const imagePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "server",
            "src",
            "public",
            "imageCategory",
            previousImageName
          );

          fs.unlinkSync(imagePath);
          await db.Category.update(
            {
              image_category: `/image-category/${image}`,
            },
            { where: { id: categoryID }, transaction }
          );
        }
        await db.Category.update(
          {
            image_category: `/image-category/${image}`,
          },
          { where: { id: categoryID }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change image category successful",
        });
      }

      await db.Category.update(
        {
          name,
        },
        { where: { id: categoryID } },
        transaction
      );
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "edit category successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  approvalActivation: async (req, res) => {
    const { userID } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const user = await db.User.findOne({
        where: { id: userID },
      });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "user not found",
        });
      }

      await db.User.update(
        {
          is_active: true,
        },
        { where: { id: userID } }
      );
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: `approval successful`,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  /* DELETE METHOD */

  deleteUser: async (req, res) => {
    const { userID } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      await db.User.destroy({ where: { id: userID } }, transaction);
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "delete user successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  deleteProduct: async (req, res) => {
    const { productID } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      await db.Product.destroy({ where: { id: productID } }, transaction);
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "delete product successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    const { categoryID } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      await db.Category.destroy({ where: { id: categoryID } }, transaction);
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "delete category successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },
};
