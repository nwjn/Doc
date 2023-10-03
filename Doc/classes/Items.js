import PriceUtils from "../../BloomCore/PriceUtils"
import { getSkyblockItemID } from "../../BloomCore/utils/Utils"

// Credits: BloomCore

export default class ItemHandler {
    constructor(item){
        this.item = item
        this.name = item.getName()
        this.itemID = getSkyblockItemID(item)
        this.itemLore = item.getLore()
        this.amount = 1

        this.getSbID()
    }

    getSbID(){
        const itemName = this.name.removeFormatting()

        if(/(Undead|Wither) Essence x(\d+)/.test(itemName)){
            const [ ar, type, amount ] = itemName.match(/(Undead|Wither) Essence x(\d+)/)

            this.itemID = `ESSENCE_${type}`.toUpperCase()
            this.amount = parseInt(amount)
        }
        if(this.itemID.startsWith("ENCHANTMENT")){
            if (this.itemLore.length < 2) return
            this.name = this.itemLore[1]
        }

        this.getValue()
    }

    getValue(){
        return Math.floor(PriceUtils.getSellPrice(this.itemID) * this.amount)
    }
}