import config from "../../config"
import { Event } from "../../core/Events"
import { Feature } from "../../core/Feature"
import { EntityArmorStand } from "../../utils/Utils"

// Credits: https://github.com/EragonTheGuy/NetherFishingUtils/blob/testing/NetherFishingUtils/index.js

// Constant variables
const feature = new Feature("timerTitleFishing", "Fishing", "")

// Logic
const registerWhen = () => World.isLoaded() && config.timerTitleFishing

const showTitleEntity = () => {
    if(!Player.getPlayer().field_71104_cf) return

    World.getAllEntitiesOfType(EntityArmorStand).forEach(entity => {
        const entityName = entity.getName()?.removeFormatting()

        if(!/^(\!\!\!|\d+\.\d+)/.test(entityName)) return

        if(config.rgbTitleFishing) entity.getEntity().func_96094_a(`§Z${entityName}`)

        Client.showTitle("", entity.getName(), 1, 10, 1)
    })
}

// Events
new Event(feature, "step", showTitleEntity, registerWhen, 5)

// Starting events
feature.start()