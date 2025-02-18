import { useState, useEffect } from "react";
import styles from "./ChatGPTPage.module.css";
import { Link } from "react-router-dom";

const ChatGPTPage = () => {
  const [ value, setValue ] = useState("")
  const [ message, setMessage ] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    // format what we send to our backend:
    const options = {
      method: "POST", 
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()

      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    // if there is a current title, then keep adding to the chat
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle, 
            role: "user",
            content: value
          }, {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)

  return (
    <div className={styles.app}>
      <section className={styles.sideBar}>
        <button className={styles.newChatButton} onClick={createNewChat}>+ New chat</button>
        <ul className={styles.history}>
          {uniqueTitles?.map((uniqueTitle, index) => <li className={styles.historyLi} key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav className={styles.chatNav}>
          <p>Made by Jasmine</p>
        </nav>
      </section>
      <section className={styles.main}>
        {!currentTitle && <h1 className={styles.heading}>"Project Doctor" GPT</h1>}
        <div className={styles.chatSection}>
        <p className={styles.chatDirect}>All done?</p>
        <Link className={styles.chatButton} to="/">Return to Dashboard</Link>
      </div>
        <ul className={styles.feed}>
          {currentChat?.map((chatMessage, index) => <li className={styles.feedLi} key={index}>
            <p className={styles.feedPRole}>{chatMessage.role}</p>
            <p className={styles.feedP} >{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className={styles.bottomSection}>
          <div className={styles.inputContainer}>
            <input className={styles.inputBox} value={value} onChange={(e) => setValue(e.target.value)}/>
            <div className={styles.chatSubmit} id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className={styles.info}>
            Chat GPT Dec 15 Version. Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default ChatGPTPage;