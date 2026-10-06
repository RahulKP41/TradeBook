import { Router } from "express";
import {
  create,
  list,
  get,
  update,
  remove,
} from "@/controllers/strategiesController";

const router = Router();

router.post("/", create);
router.get("/", list);
router.get("/:id", get);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;