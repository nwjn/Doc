import RenderLib from "../../../RenderLib"
import config from "../../config"
import { Event } from "../../core/Events"
import { Feature } from "../../core/Feature"
import { WorldState } from "../../shared/World"
import { EntityArmorStand } from "../../utils/Utils"

// Constant variables
const feature = new Feature("mobESP", "Dungeons", "")
const requiredWorld = "Catacombs"

// Changeable variables
let mobsArray = []

// Logic
const registerWhen = () => WorldState.getCurrentWorld() === requiredWorld && config.mobESP

// Events
new Event(feature, "step", () => {
    mobsArray = World.getAllEntitiesOfType(EntityArmorStand).filter(entity => entity.getName().includes("✯ ") && !entity.getName().includes("Fels"))
}, registerWhen, 3)

new Event(feature, "renderWorld", () => {
    mobsArray.forEach(entity => {
        const [ x, y, z ] = [entity.getRenderX(), entity.getRenderY(), entity.getRenderZ()]

        RenderLib.drawEspBox(x, y-2, z, 0.6, 2, 0, 35, 243, 255, false)
    })
}, registerWhen)

// Starting events
feature.start()