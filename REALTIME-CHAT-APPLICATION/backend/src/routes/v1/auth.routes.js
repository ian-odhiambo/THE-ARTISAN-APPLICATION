import express from "express";
import {login, logOut, signUp, syncUser} from "../../controllers/auth.controller.js"
const router = express.Router();

router.post("/signup", signUp);

router.post("/sync-user", syncUser);

router.post("/login", login);

router.get("/logOut", logOut);

export default router;