const { Router } = require("express");

const controllers = require("../controllers/controllers");

const router = Router();

router.get("/", controllers.getAllMessagesWithoutAuthorDetails);
router.get("/sign-up", controllers.addNewUserGet);
router.post("/sign-up", controllers.addNewUserPost);
router.get("/log-in", controllers.logInGet);
router.post("/log-in", controllers.logInPost);

module.exports = router;
