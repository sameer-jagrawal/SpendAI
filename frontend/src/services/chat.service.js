import api from "./api.js"

export const sendMessage = async (message,conversationId)=>{
    const response = await api.post("/chat",{
        message,
        conversationId
    })

    console.log(response)

    return response.data
}
