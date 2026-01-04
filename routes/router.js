const { Router } = require("express");

const controllers = require("../controllers/controllers");

const router = Router();

router.get("/", controllers.getMessagesWithoutAuthorDetails);
router.get("/sign-up", controllers.signUpGet);
router.post("/sign-up", controllers.signUpPost);
router.post("/log-in", controllers.logIn);
router.get("/log-out", controllers.logOut);
router.post("/members", controllers.logInMember);
router.get("/members", controllers.getMessagesWithAuthorDetails);

module.exports = router;
