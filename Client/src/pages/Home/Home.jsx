import React from 'react'
import Sidebar from '../../components/Sidebar/sidebar'
import MessageContainer from '../../components/message/message-container'
import useConversation from '../../zustand/useconversation'

function Home() {
  const { selectedConversation } = useConversation();
  return (
    <div className='flex h-full w-full overflow-hidden'>
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-auto`}>
        <Sidebar />
      </div>
      <div className={`${!selectedConversation ? 'hidden md:flex' : 'flex'} flex-1`}>
        <MessageContainer />
      </div>
    </div>
  )
}

export default Home