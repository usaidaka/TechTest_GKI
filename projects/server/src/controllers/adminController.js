module.exports = {
  adminTest: async (req, res) => {
    try {
      res.status(200).json({
        ok: true,
        message: "admin test successful",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Fatal error",
        error: error.message,
      });
    }
  },
};
