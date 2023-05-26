const { ChatGPTAPI } = require("@twinklepkg/chatgpt");

let api = new ChatGPTAPI({ apiKey: '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' })

async function apisenderlol() {

    console.log('hyefoihqweoirfu\n\n\neriotuqyheorituqherituqeht\nqweiouqwoeiurhqweoriuqwrqw\n\n\nwqerqwerqwr')
    
    let res = await api.sendMessage('hello')

    console.log(res.text)

}


apisenderlol()
