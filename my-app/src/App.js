import {Navigation, Footer, RotatingImage, Fields, NavigationAdminISS} from './components/main-components'
import { Register } from './components/register-components';
import { DocumentInfo } from './components/document-item-components';
import { MyDocuments } from './components/my-documents-components';
import { UsersAdmin, UsersISS } from './components/admin-components';
import { Login } from './components/login-components';
import { FieldDocuments } from './components/field-item-components';
import React, { useState , useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import {getTournamentsUrl, postGetTournamentUrl} from "./const_urls"

function App() {

  const [responseData, setResponseData] = useState(null);
  const [pageState, setPageState] = useState('login');
  useEffect(() => {
    const isUserLogged = localStorage.getItem('is_logged') === 'true';
    const isAdminLogged = localStorage.getItem('is_logged_admin') === 'true';
    const isISSLogged = localStorage.getItem('is_logged_iss') === 'true';
    if (isUserLogged) {
      setPageState('main');
    } else if (isAdminLogged) {
      setPageState('main-admin');
    }
    else if (isISSLogged) {
      setPageState('main-iss');
    } else {
      setPageState('login');
    }
  }, []);
  

  const main_page = 'main';
  const main_page_admin = 'main-admin';
  const main_page_iss = 'main-iss';


  const my_documents_page = 'my-documents'
  const my_documents_page_admin = 'my-documents-admin'
  const my_documents_page_iss = 'my-documents-iss'


  const document_item_page = 'document-item'
  const document_item_page_admin = 'document-item-admin'
  const document_item_page_iss = 'document-item-iss'


  const documents_page = 'documents'
  const documents_page_admin = 'documents-admin'
  const documents_page_iss = 'documents-iss'

  const users_page_admin = 'users-admin'
  const users_page_iss = 'users-iss'


  const login_page = 'login';
  const register_page = 'register';
  

  

  const setMyDocumentsPageState = () => {
    setPageState(my_documents_page)
  }
  const setMyDocumentsAdminPageState = () => {
    setPageState(my_documents_page_admin)
  }
  const setMyDocumentsISSPageState = () => {
    setPageState(my_documents_page_iss)
  }


  
  const setDocumentsPageState = () => {
    setPageState(documents_page)
  }
  const setDocumentsAdminPageState = () => {
    setPageState(documents_page_admin)
  }
  const setDocumentsISSPageState = () => {
    setPageState(documents_page_iss)
  }



  const setDocumentItemPageState = () => {
    setPageState(document_item_page)
  }
  const setDocumentItemAdminPageState = () => {
    setPageState(document_item_page_admin)
  }
  const setDocumentItemISSPageState = () => {
    setPageState(document_item_page_iss)
  }







  const setMainAdminPageState = () => {
    setPageState(main_page_admin)
  }
  const setMainISSPageState = () => {
    setPageState(main_page_iss)
  }
  const setMainPageState = () => {
    setPageState(main_page)
  }



  const setUsersAdminPageState = () => {
    setPageState(users_page_admin)
  }
  const setUsersISSPageState = () => {
    setPageState(users_page_iss)
  }



  const setLoginPageState = () => {
    setPageState(login_page)
  }
  const setRegisterPageState = () => {
    setPageState(register_page)
  }



  let mainPage = () => {return <div className="main-page">
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                <div>
                                <Navigation HomeColor = {"backColor"} home={setMainPageState} my_documents={setMyDocumentsPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged', 'false'); localStorage.setItem('user', " ")}}/>
                                </div>
                                <div className='label-name-div'>
                                  <p className='label-name'>Fields </p>
                                </div>
                                <div>
                                  <Fields click={setDocumentsPageState}/>
                                </div>
 
                              </div>}
  let mainPageAdmin = () => {return <div className="main-page">
                                                        <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                <div>
                                <NavigationAdminISS HomeColor = {"backColor"} home={setMainAdminPageState} my_documents={setMyDocumentsAdminPageState} users={setUsersAdminPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged_admin', 'false'); localStorage.setItem('user', " ")}}/>
                                </div>
                                <div className='label-name-div'>
                                  <p className='label-name'>Fields </p>
                                </div>
                                <div>
                                  <Fields click={setDocumentsAdminPageState}/>
                                </div>
   
                              </div>}
    let mainPageISS = () => {return <div className="main-page">
                              <div>
        <p className='line-for-nav'> </p>
      </div>
      <div>
      <NavigationAdminISS HomeColor = {"backColor"} home={setMainISSPageState} my_documents={setMyDocumentsISSPageState} users={setUsersISSPageState} exit={()=>{setLoginPageState() 
        localStorage.setItem('is_logged_iss', 'false'); localStorage.setItem('user', " ")}}/>
      </div>
      <div className='label-name-div'>
        <p className='label-name'>Fields </p>
      </div>
      <div>
        <Fields click={setDocumentsISSPageState}/>
      </div>

    </div>}









let DocumentsPage = () => {return  <div className="documents-page">
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                              <div>
                                <Navigation HomeColor = {"backColor"} home={setMainPageState} my_documents={setMyDocumentsPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged', 'false'); localStorage.setItem('user', " ")}}/>
                                </div>
                              <div>
                                  <FieldDocuments clickDocument={setDocumentItemPageState}/>
                                    </div>
                              </div>}
let DocumentsAdminPage = () => {return  <div className="documents-page">
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                <div>
                                <NavigationAdminISS HomeColor = {"backColor"} home={setMainAdminPageState} my_documents={setMyDocumentsAdminPageState} users={setUsersAdminPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged_admin', 'false'); localStorage.setItem('user', " ")}}/>
                                </div>
                                <div>
                                  <FieldDocuments clickDocument={setDocumentItemAdminPageState}/>
                                    </div>
                                </div>}


let DocumentsISSPage = () => {return  <div className="documents-page">
                                  <div>
                                    <p className='line-for-nav'> </p>
                                  </div>
                                  <div>
                                  <NavigationAdminISS HomeColor = {"backColor"} home={setMainISSPageState} my_documents={setMyDocumentsISSPageState} users={setUsersISSPageState} exit={()=>{setLoginPageState() 
                                    localStorage.setItem('is_logged_iss', 'false'); localStorage.setItem('user', " ")}}/>
                                  </div>
                                  <div>
                                    <FieldDocuments clickDocument={setDocumentItemISSPageState}/>
                                      </div>
                                  </div>}







let MyDocumentsPage = () => {return  <div className="my-documents-page">
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                              <div>
                                <Navigation MyDocumentsColor = {"backColor"} home={setMainPageState} my_documents={setMyDocumentsPageState}  exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged', 'false')}}/>
                                </div>
                              <div>
                              <div>
                                <MyDocuments clickDocument={setDocumentItemPageState}/>
                              </div>
                              </div>
                              </div>}

let MyDocumentsAdminPage = () => {return  <div className="my-documents-page">
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                              <div>
                              <NavigationAdminISS MyDocumentsColor = {"backColor"} home={setMainAdminPageState} my_documents={setMyDocumentsAdminPageState} users={setUsersAdminPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged_admin', 'false'); localStorage.setItem('user', " ")}}/>
                                </div>
                              <div>
                              <div>
                                <MyDocuments clickDocument={setDocumentItemAdminPageState}/>
                              </div>
                              </div>
                              </div>}

let MyDocumentsISSPage = () => {return  <div className="my-documents-page">
                              <div>
                                <p className='line-for-nav'> </p>
                              </div>
                              <div>
                              <NavigationAdminISS MyDocumentsColor = {"backColor"} home={setMainISSPageState} my_documents={setMyDocumentsISSPageState} users={setUsersISSPageState} exit={()=>{setLoginPageState() 
                                    localStorage.setItem('is_logged_iss', 'false'); localStorage.setItem('user', " ")}}/>
                              </div>
                              <div>
                              <div>
                              <MyDocuments clickDocument={setDocumentItemISSPageState}/>
                              </div>
                              </div>
                              </div>}








let DocumentItemPage = () => {return  <div className="documents-page">
                          <div>
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                <div>
                                <Navigation HomeColor = {"backColor"} home={setMainPageState} my_documents={setMyDocumentsPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged', 'false'); localStorage.setItem('user', " ");}}/>
                                </div>
                                <div>
                                  <DocumentInfo/>
                                </div>
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                </div>
            
                          </div>}            
                
let DocumentItemAdminPage = () => {return  <div className="documents-page">
                          <div>
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                <div>
                                <NavigationAdminISS MyDocumentsColor = {"backColor"} home={setMainAdminPageState} my_documents={setMyDocumentsAdminPageState} users={setUsersAdminPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged_admin', 'false'); localStorage.setItem('user', " ")}}/>
                                </div>
                                <div>
                                  <DocumentInfo/>
                                </div>
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                <div>
                                  <p className='line-for-nav'> </p>
                                </div>
                                </div>
            
                          </div>}   
let DocumentItemISSPage = () => {return  <div className="documents-page">
<div>
      <div>
        <p className='line-for-nav'> </p>
      </div>
      <div>
      <NavigationAdminISS MyDocumentsColor = {"backColor"} home={setMainISSPageState} my_documents={setMyDocumentsISSPageState} users={setUsersISSPageState} exit={()=>{setLoginPageState() 
                                    localStorage.setItem('is_logged_iss', 'false'); localStorage.setItem('user', " ")}}/>
      </div>
      <div>
        <DocumentInfo/>
      </div>
      <div>
        <p className='line-for-nav'> </p>
      </div>
      <div>
        <p className='line-for-nav'> </p>
      </div>
      </div>

</div>}   

let usersAdminPage = () => {return  <div className="my-documents-page">
                              <div>
                                <p className='line-for-nav'> </p>
                              </div>
                              <div>
                              <NavigationAdminISS UsersColor = {"backColor"} home={setMainAdminPageState} my_documents={setMyDocumentsAdminPageState} users={setUsersAdminPageState} exit={()=>{setLoginPageState() 
                                  localStorage.setItem('is_logged_admin', 'false'); localStorage.setItem('user', " ")}}/>
                                </div>
                              <div>
                              <div>
                              <UsersAdmin/>
                              </div>
                              </div>
                              </div>}

let usersISSPage = () => {return  <div className="my-documents-page">
                              <div>
                                <p className='line-for-nav'> </p>
                              </div>
                              <div>
                              <NavigationAdminISS UsersColor = {"backColor"} home={setMainISSPageState} my_documents={setMyDocumentsISSPageState} users={setUsersISSPageState} exit={()=>{setLoginPageState() 
                                    localStorage.setItem('is_logged_iss', 'false'); localStorage.setItem('user', " ")}}/>
                              </div>
                              <div>
                              <div>
                              <UsersISS/>
                              </div>
                              </div>
                              </div>}


  let registerPage = () => {return <div className='App'><Register click={setLoginPageState} redirect={setLoginPageState}/></div>}

  let loginPage = () => {return <div className='App'><Login redirect={setRegisterPageState} clickUser={setMainPageState} clickAdmin={setMainAdminPageState}clickISS={setMainISSPageState}/></div>}

  

  let pages = {'main': mainPage, 'login': loginPage, 'register': registerPage, 
   'documents': DocumentsPage,'documents-admin': DocumentsAdminPage,'documents-iss': DocumentsISSPage,
   'my-documents': MyDocumentsPage, 'my-documents-admin': MyDocumentsAdminPage,'my-documents-iss': MyDocumentsISSPage,
   'document-item': DocumentItemPage, 'document-item-admin': DocumentItemAdminPage,'document-item-iss': DocumentItemISSPage,'main-admin': mainPageAdmin, 'main-iss': mainPageISS,
   'users-admin': usersAdminPage,'users-iss': usersISSPage, }
  let page = pages[pageState]();

  
  return (
    page
  );
}

export default App;
