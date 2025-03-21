import { useState, useEffect } from "react";
import styles from "./DashboardPage.module.css";
import { Link } from "react-router-dom";
// import { PROJECT_ID, DATABASE_ID, COLLECTION_ID } from "../shhh";
// import "dotenv/config"
import { Client, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_REACT_APP_PROJECT_ID);

const databases = new Databases(client);
const form = document.querySelector('form')

async function addVisionsToDom(){
  document.querySelector('ul').innerHTML = ""
  let response = await databases.listDocuments(
    import.meta.env.VITE_REACT_APP_DATABASE_ID,
    import.meta.env.VITE_REACT_APP_COLLECTION_ID,    
  )
  response.documents.forEach(vision => {
    const li = document.createElement('li')
    li.id = vision.$id
    li.className = styles.appBoxes

    const visionName = document.createElement('h4')
    visionName.textContent = `${vision['app-name']}`
    visionName.className = styles.visionTitle

    const span = document.createElement('span')
    span.innerHTML = `Purpose: <br> ${vision.purpose}`
    span.className = styles.purpose
    
    const paragraph = document.createElement('p')
    paragraph.innerHTML = `Features: <br> ${vision.features}`
    paragraph.className = styles.features

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = '🧨'
    deleteBtn.className = styles.deleteButton
    deleteBtn.onclick = () => removeVision(vision.$id)

    li.appendChild(visionName)
    li.appendChild(span)
    li.appendChild(paragraph)
    li.appendChild(deleteBtn)

    document.querySelector('ul').appendChild(li)

  });

  async function removeVision(id) {
    const result = await databases.deleteDocument(
      import.meta.env.VITE_REACT_APP_DATABASE_ID,
      import.meta.env.VITE_REACT_APP_COLLECTION_ID,
      id
    )
    document.getElementById(id).remove()
    // result.then(() => location.reload())
  }
}

addVisionsToDom()

const DashboardPage = () => {

  const [formData, setFormData] = useState({
    appName: "",
    dateAdded: "",
    purpose: "",
    features: ""
  })

  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    if (!isDataLoaded) {
      addVisionsToDom()
      setIsDataLoaded(true)
    }
  }, [isDataLoaded])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const vision = databases.createDocument(
      import.meta.env.VITE_REACT_APP_DATABASE_ID,
      import.meta.env.VITE_REACT_APP_COLLECTION_ID,
      ID.unique(),
      { "app-name": e.target.appName.value,
        "date-added": e.target.dateAdded.value,
        "purpose": e.target.purpose.value,
        "features": e.target.features.value
      }
    )
    vision.then(function (response) {
      console.log("Form submitted:", formData)
      addVisionsToDom()
      form.reset()
    }, function (error) {
      console.log(error)
    })
  }

  return (
    <>
      <div className={styles.chatSection}>
        <p className={styles.chatDirect}>Feeling stuck? Chat with the Project Doctor to narrow down an idea!</p>
        <Link className={styles.chatButton} to="/chat">CHAT NOW</Link>
      </div>
      <ul></ul>
      <form className={styles.appForm} onSubmit={handleSubmit}>
        <input className={styles.formField} type="text" placeholder="App Name" name="appName" value={formData.appName} onChange={handleChange} />
        <input className={styles.formField} type="date" placeholder="" name="dateAdded" value={formData.dateAdded} onChange={handleChange} />
        <input className={styles.formField} type="text" placeholder="Purpose" name="purpose" value={formData.purpose} onChange={handleChange} />
        <input className={styles.formField} type="text" placeholder="Features" name="features" value={formData.features} onChange={handleChange} />
        <input className={styles.formField} type="submit" id="submit" value="Submit" />
      </form>
    </>
  );
};  

export default DashboardPage