import { Router } from "express";
import expenseController from "../controllers/expense.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/expense/create", auth, expenseController.create);
router.get("/expense/list", auth, expenseController.list);
router.delete("/expense/remove/:id", auth, expenseController.remove);
router.put("/expense/edit/:id", auth, expenseController.edit);

export default router;
