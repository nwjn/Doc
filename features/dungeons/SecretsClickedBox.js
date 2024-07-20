import config from "../../config"
import { Event } from "../../core/Event"
import EventEnums from "../../core/EventEnums"
import Feature from "../../core/Feature"
import { RenderHelper } from "../../shared/Render"

// Wither skull / Redstone skull
const allowedIDs = new Set(["26bb1a8d-7c66-31c6-82d5-a9c04c94fb02", "edb0155f-379c-395a-9c7d-1b6005987ac8"])
const secretBlocks = new Set(["minecraft:chest", "minecraft:lever", "minecraft:skull", "minecraft:trapped_chest"])
const lockedRegex = /^That chest is locked!$/
const blocksToHighlight = new Map()

const checkSkullTexture = (bp) => allowedIDs.has(World.getWorld()?.func_175625_s(bp)?.func_152108_a()?.id?.toString())

let locked = false

const feat = new Feature("showSecretsClicked", "catacombs")
    .addEvent(
        new Event(EventEnums.PACKET.CLIENT.BLOCKPLACEMENT, (ctBlock, _, bp) => {
            const blockName = ctBlock.type.getRegistryName()

            if (!secretBlocks.has(blockName) || blockName === "minecraft:skull" && !checkSkullTexture(bp)) return

            const blockString = ctBlock.toString()
            if (blocksToHighlight.has(blockString)) return

            blocksToHighlight.set(blockString, {
                block: ctBlock
            })

            feat.update()

            Client.scheduleTask(20, () => {
                blocksToHighlight.delete(blockString)
                locked = false
                feat.update()
            })
        }, false)
    )
    .addEvent(
        new Event(EventEnums.PACKET.SERVER.CHAT, () => locked = true, lockedRegex)
    )
    .addSubEvent(
        new Event("renderWorld", () => {
            blocksToHighlight.forEach(obj => {
                const block = obj.block
                const isChest = block.type.mcBlock instanceof net.minecraft.block.BlockChest

                const r = locked && isChest ? 255 : config().showSecretsClickedColor[0]
                const g = locked && isChest ? 0 : config().showSecretsClickedColor[1]
                const b = locked && isChest ? 0 : config().showSecretsClickedColor[2]
        
                RenderHelper.filledBlock(block, r, g, b, 51, true)
                RenderHelper.outlineBlock(block, r, g, b, 255, true, 2)
            })
        }), () => blocksToHighlight.size
    )