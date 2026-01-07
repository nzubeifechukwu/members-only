const { Router } = require("express");

const controllers = require("../controllers/controllers");

const router = Router();

router.get("/", controllers.getMessagesWithoutAuthorDetails);
router.get("/sign-up", controllers.signUpGet);
router.post("/sign-up", controllers.signUpPost);
router.post("/log-in", controllers.logIn);
router.get("/log-out", controllers.logOut);
router.post("/member/:id", controllers.logInMember);
router.get("/member/:id", controllers.getMessagesWithAuthorDetails);
router.get("/member/:id/create", controllers.createPostGet);
router.post("/member/:id/create", controllers.createPostPost);

module.exports = router;
