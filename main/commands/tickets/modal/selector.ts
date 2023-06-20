import { Interaction, Client } from "discord.js";

export const selector = async(interaction: Interaction, client: Client) => {

    if (interaction.isAnySelectMenu()) {
        let ok = ""
        let another = ""
    
        interaction.values.forEach(int => {
    
          if (int === "KPC") {
            ok = "<@&1119939626208084019>"
          } else if (int === "NACK") {
            ok = "<@&1119939642674913320>"
          } else if (int === "CKA") {
            ok = "<@&1119939673834401853>"
          } else if (int === "Multiple") {
            ok = "<@&1117740774025592883>"
          }
    
        })
    
        if (ok === "<@&1119939626208084019>") {
          another = "KPC"
        } else if (ok === "<@&1119939642674913320>") {
          another = "NACK"
        } else if (ok === "<@&1119939673834401853>") {
          another = "CKA"
        } else if (ok === "<@&1117740774025592883>") {
          another = "2 or more comp servers"
        }
    
        interaction.message.delete()
        interaction.channel?.send(`${ok}, user is banned in ${another}`)
      }
}