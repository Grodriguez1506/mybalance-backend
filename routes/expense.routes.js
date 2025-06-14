import { Router } from "express";
import expenseController from "../controllers/expense.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/expense/create", auth, expenseController.create);
router.get("/expense/list", auth, expenseController.list);
router.delete("/expense/remove/:id", auth, expenseController.remove);
router.put("/expense/edit/:id", auth, expenseController.edit);
router.put("/expense/pay/:id", auth, expenseController.payExpense);
router.put("/expense/unmark/:id", auth, expenseController.unmark);
router.post("/expense/set-period", auth, expenseController.setPeriod);
router.get("/expense/unpaid-list", auth, expenseController.unpaidList);
router.get("/expense/paid-list", auth, expenseController.paidList);
router.get("/expense/historical", auth, expenseController.historical);

export default router;
