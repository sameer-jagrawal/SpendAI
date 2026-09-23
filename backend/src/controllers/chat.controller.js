import askLLM from "../services/llm.service.js";

const chat = async (req, res) =>{
    try {
        const {message} = req.body;
        const {conversationId} = req.body;
        console.log(conversationId, "Conversation id")
        if (!message || typeof message !== "string") {
            return res.status(400).json({
              success: false,
              message: "Message is required"
            });
          }

        if(!conversationId ||  typeof conversationId !== 'string'){
            return res.status(404).json({
                success:false,
                message:"conversationId is required"
            })
        }
        
        const response = await askLLM(message, conversationId)

        return res.status(200).json({
            success:true,
            message:response.message,
            toolResults: response.toolResults
        })

    } catch (error) {

        console.log(error.message)

        return res.status(500).json({
            success:false,
            message:"Something went wrong while processing your request"
        })
        
    }
}


export default chat;