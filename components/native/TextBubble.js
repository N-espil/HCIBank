import { forwardRef  } from 'react'
import { IonNavLink } from '@ionic/react'

export default forwardRef (function TextBubble({msg, pos = "start", color = "chat-bubble-primary", Link, type = "reply", option = false, onClick = () => { } }, ref) {
   
    if (pos == "start") {
        return (
            <div className={`my-3 transition-all duration-300 ease-out chat-start ${option && "active:scale-105"} chat`}>

                {
                    type == "reply" ?
                        <div className={`rounded-lg chat-bubble chat-bubble-primary chat-bubble-fade-in text-neutral`} onClick={() => { option && onClick() }} dangerouslySetInnerHTML={{ __html: msg }} >
                            
                        </div>
                        :
                        <div className={`rounded-lg chat-bubble chat-bubble-primary chat-bubble-fade-in text-neutral`} onClick={() => { option && onClick() }}  >
                            {msg}
                        </div>

                }
                <IonNavLink className="invisible pointer-events-none" ref={ref} routerDirection="forward" component={() => Link} ></IonNavLink>
            </div>
        )
    }
    else {
        return (
            <div className="my-3 chat-end chat">
                <div className="rounded-lg chat-bubble bg-[#FFFBF9] chat-bubble-fade-in chat text-neutral">{msg}</div>
            </div>
        )
    }
})