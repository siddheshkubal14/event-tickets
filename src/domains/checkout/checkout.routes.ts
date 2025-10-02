import { Router } from "express";
import { checkoutController } from "./checkout.controller";
import { validate } from "../../middlewares/validate";
import {
    ReserveCheckoutSchema,
    ConfirmCheckoutSchema,
    CancelCheckoutSchema
} from "./checkout.schema";

const checkoutRouter = Router();

checkoutRouter.post("/reserve", validate(ReserveCheckoutSchema), checkoutController.reserve.bind(checkoutController));
checkoutRouter.post("/confirm", validate(ConfirmCheckoutSchema), checkoutController.confirm.bind(checkoutController));
checkoutRouter.post("/cancel", validate(CancelCheckoutSchema), checkoutController.cancel.bind(checkoutController));

export default checkoutRouter;
