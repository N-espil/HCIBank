import { useRouter } from "next/router";
export default function ChatBubble({  msg, pos = "start", Link, type = "reply", option = false, onClick = () => { } }) {
    const router = useRouter()

    const handleClick = () => {
        setTimeout(() => {
            router.push(Link)
        }, 1500);
    }
    if (pos == "start") {
        return (
            <div className={`my-3 transition-all duration-300 ease-out chat-start ${option && "active:scale-105"} chat`}>

                {
                    type == "reply" ?
                        <div className={`rounded-lg chat-bubble chat-bubble-primary chat-bubble-fade-in text-neutral text-xs xl:pb-4 xl:text-base`} onClick={() => { option && onClick() }} dangerouslySetInnerHTML={{ __html: msg }} >

                        </div>
                        :
                        <div className={`rounded-lg chat-bubble chat-bubble-primary chat-bubble-fade-in text-neutral text-xs xl:pb-4 xl:text-base`} onClick={() => { option && onClick() }}  >
                            <div onClick={handleClick} >{msg}</div>
                        </div>

                }
            </div>
        )
    }
    else {
        return (
            <div className="my-3 chat-end chat">
                <div className="rounded-lg chat-bubble bg-[#FFFBF9] chat-bubble-fade-in chat text-neutral text-xs xl:pb-4 xl:text-base">{msg}</div>
            </div>
        )
    }
}