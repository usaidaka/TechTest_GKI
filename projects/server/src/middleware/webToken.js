const jwt = require("jsonwebtoken");

module.exports = {
  verifyAccessTokenUser: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }

        const { role_id } = payload;
        if (role_id === 2) {
          req.user = payload;
          next();
          return;
        }
        return res.status(403).send({
          ok: false,
          message: "Unauthorized role",
        });
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          error,
        });
      }
    }
  },

  verifyAccessTokenAdmin: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }

        const { role_id } = payload;
        if (role_id === 1) {
          req.user = payload;
          next();
          return;
        }
        return res.status(403).send({
          ok: false,
          message: "Unauthorized role",
          role: payload,
        });
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          payload: authorization,
          error,
        });
      }
    }
  },

  verifyAccessTokenAllRole: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }

        const { role_id } = payload;
        if (role_id === 1 || role_id === 2) {
          req.user = payload;
          next();
          return;
        }
        return res.status(403).send({
          ok: false,
          message: "Unauthorized role",
          role: payload,
        });
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          payload: authorization,
          error,
        });
      }
    }
  },

  token: (dataToken, secretToken, exp) => {
    const token = jwt.sign(dataToken, secretToken, {
      expiresIn: `${exp}`,
    });
    return token;
  },
};
