import { Event } from "../../core/Event"
import Feature from "../../core/Feature"
import { TextHelper } from "../../shared/TextHelper"

const avoidGuis = [
    "Wardrobe",
    "Drill Anvil",
    "Anvil",
    "Storage",
    "The Hex",
    "Composter",
    "Auctions",
    "Abiphone"
]

new Feature("middleClickGui")
    .addEvent(
        new Event("guiMouseClick", (_, __, mbtn, gui, event) => {
            if (mbtn !== 0 || !(gui instanceof net.minecraft.client.gui.inventory.GuiChest)) return

            const container = Player.getContainer()
            const containerSize = container.getSize() - 36

            const slot = gui.getSlotUnderMouse()?.field_75222_d
            if (!slot || slot >= containerSize || avoidGuis.some(it => container.getName()?.startsWith(it))) return

            const item = container.getItems()[slot]
            if (
                item?.getName()?.removeFormatting() === "Reforge Item" ||
                item?.getName()?.removeFormatting() === "Salvage Item"
                ) return
            if (TextHelper.getSkyblockItemID(item)) return

            cancel(event)
            container.click(slot, false, "MIDDLE")
        })
    )