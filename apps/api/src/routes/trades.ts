import { Router } from "express";
import {
  create,
  list,
  get,
  update,
  remove,
} from "@/controllers/tradesController";
import {
  create as createJournal,
  get as getJournal,
  update as updateJournal,
  remove as removeJournal,
} from "@/controllers/journalsController";

const router = Router();

router.post("/", create);
router.get("/", list);
router.get("/:id", get);
router.patch("/:id", update);
router.delete("/:id", remove);

router.post("/:id/journal", createJournal);
router.get("/:id/journal", getJournal);
router.patch("/:id/journal", updateJournal);
router.delete("/:id/journal", removeJournal);

export default router;