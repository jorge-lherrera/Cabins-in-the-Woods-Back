const Worker = require("../models/Worker");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class SessionController {
  async getSession(req, res, next) {
    try {
      const worker = await Worker.findByPk(req.user.id);

      if (!worker) {
        return next({
          resource: null,
          error: {
            status: 401,
            errorCode: "USER_NOT_FOUND",
            message: MESSAGES.GENERAL.NOT_FOUND("Funcionário"),
            source: "auth - session",
            detalhes: MESSAGES.LOGIN.AUTHENTICATION_FAILED,
          },
          status: 401,
        });
      }

      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Funcionário"),
        {
          id: worker.id,
          name: worker.name,
          avatar: worker.avatar,
          email: worker.email,
        },
        "worker"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SessionController();
