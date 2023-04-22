import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import { leparser } from "./src/func/index"


const service = new HumanizeDuration(new HumanizeDurationLanguage())

console.log(
    service.humanize(leparser('12 days')!)
)
