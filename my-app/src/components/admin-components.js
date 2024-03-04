import '../styles/main.css';
import React, { useState, useEffect } from 'react';
import { UpdateUserUrl, GetUsersUrl} from '../const_urls';
import classnames from 'classnames';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import '../styles/admin.css';


export const UsersAdmin = (props) => {
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [UsersData, setUsersData] = useState({ users: [] });
    const [loading, setLoading] = useState(true);
    const [searchUser, setSearchUser] = useState('');
    const [formUpdateSubmitted, setFormUpdateSubmitted] = useState(false);
    const [UpdateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState(null);

    const openUpdateDialog = (user) => {
        setUserToUpdate(user);
        setUpdateDialogOpen(true);
      };
      
      const closeUpdateDialog = () => {
        setUserToUpdate(null);
        setUpdateDialogOpen(false);
        setFormUpdateSubmitted(false);
      };
      const ErrorFuncUpdate = () => {
        setFormUpdateSubmitted(true);
      
      };
    useEffect(() => {
      axios.get(GetUsersUrl).then(response => {setUsersData(response['data']); setLoading(false);
      setCurrentPage(1);});
    }, [userToUpdate]);
    
  
    let users = UsersData !== null ? UsersData['users'] : '';
  
    
    const filtered_search_user = users.filter(user => {
      return user.username.toLowerCase().includes(searchUser.toLowerCase())
    })
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const currentItems = filtered_search_user.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(filtered_search_user.length / itemsPerPage);
    
  
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
  
    const goFirstPage = () => {
      setCurrentPage(1);
    };
  
    const goLastPage = () => {
      setCurrentPage(totalPages);
    };
  
    const visiblePageCount = 3;
    const firstVisiblePage = Math.max(1, Math.min(currentPage - Math.floor(visiblePageCount / 2), totalPages - visiblePageCount + 1));
  
    const visiblePages = Array.from({ length: visiblePageCount }, (_, index) => {
      const page = firstVisiblePage + index;
  
      return page;
    }).filter((page) => page >= 1 && page <= totalPages);
  
    const isFinalPageVisible = !visiblePages.includes(totalPages);
    const isFirstPageVisible = !visiblePages.includes(1);
  
  
  
    return (
      <div>
        <div className='search-div'>
            <input
            type="text"
            className='search'
            placeholder="Search by username"
            onChange={(event) => setSearchUser(event.target.value)}
          />
          </div>
        <div className="field-div">

        <div className="table-div">
                <table className='table-users'>
                    <thead>
                        <tr>
                            <th className='head-table'>ID</th>
                            <th className='head-table'>Username</th>
                            <th className='head-table'>Email</th>
                            <th className='head-table'>Access Level</th>
                            <th className='head-table'>Field</th>
                            <th className='head-table'>Change user data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user, index) => (
                            <tr key={index} className='row-table'>
                                <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.id_user}</td>
                                <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.username}</td>
                                <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.email}</td>
                                <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.access_level}</td>
                                <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.field}</td>
                                <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>
                                <button type="button" className="btn btn-primary but-user " onClick={() => openUpdateDialog(user)}>Update data</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
                  {UpdateDialogOpen && (
            <div className="confirmation-dialog">
              <div>
                
                <Formik
                initialValues={{
                  id_user: userToUpdate.id_user,
                  access_level: userToUpdate.access_level,
                  field: userToUpdate.field,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.access_level) {
                    errors.access_level = 'Данное поле должно быть заполнено';
                  }  
                  if (!values.field) {
                    errors.field = 'Данное поле должно быть заполнено';
                  }  
                  return errors;
                }}
                

                onSubmit={(values, { setSubmitting }) => {

                  axios.post(UpdateUserUrl,{id_user: userToUpdate.id_user, access_level: values.access_level, field: values.field})
                  .then((response) => {
                    console.log('Документ успешно обновлен', response);
                    closeUpdateDialog();
                  
                  })
                  .catch((error) => {
                    console.error('Ошибка при обновлении уровня доступа', error);

                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
                }}

                
              >
                {({ errors, touched,setFieldValue, values  }) => (
                  <div className=" ">
                    <Form className=" " enctype="multipart/form-data">

                      <div className="label-auto-div">
                        <div className="label-auto">Changing user data</div>
                      </div>

                      <div className="label-login-div">
                        <label className="label-login">User</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="id_user" 
                        name="id_user" 
                        readOnly
                        value= {userToUpdate.username}
                        className={`field-write-2 form-login ${errors.id_user && formUpdateSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>

                      <div className="label-login-div">
                        <label className="label-login">Access level</label>
                      </div>
                      <div className="form-login-div">
                      <Field
                        as="select"
                        id="access_level"
                        name="access_level"
                        className={`field-write-2 form-login ${errors.access_level && formUpdateSubmitted ? 'field-error-2' : ''}`}
                      >
                              <option key={1} value="A">
                                A (Public)
                              </option>
                              <option key={2} value="B">
                                B (For internal use)
                              </option>
                              <option key={3} value="C">
                                C (Confidentially)
                              </option>
                              <option key={4} value="D">
                                D (Very confidential)
                              </option>
                        </Field>
                      </div>



                      <div className="label-login-div">
                        <label className="label-login">Field</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="field" 
                        name="field" 
                        className={`field-write-2 form-login ${errors.name && formUpdateSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>
                      {formUpdateSubmitted && errors.field && touched.field && (
                        <div className="error-2">{errors.field}</div>
                      )}
        
                      <div className='buttons-dialog'>
                        <button className='btn btn-success delete-dialog' type="submit" onClick={ErrorFuncUpdate}>Confirm changes</button>
                        <button className='btn btn-danger delete-dialog' onClick={closeUpdateDialog}>Cancel</button>
                      </div>
                    </Form>
                  </div>
                )}
              </Formik>
              </div>
            </div>
          )}
               {!loading &&(<div className="pagination-div">
                  <button
                    className={classnames("page-button-np", {
                      "page-button-np-dis": currentPage === 1,
                    })}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous page
                  </button>
                  {isFirstPageVisible ? (
                    <button
                      className={classnames("page-button-ff page-button-f", {
                        "active-page": currentPage === 1,
                      })}
                      onClick={() => goFirstPage()}
                    >
                      1
                    </button>
                  ) : null}
          
                  {visiblePages.map((page) => (
                    <button
                      className={classnames("page-button", {
                        "active-page": page === currentPage,
                      })}
                      key={page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  {isFinalPageVisible ? (
                    <button
                      className={classnames("page-button-ff", {
                        "active-page": totalPages === currentPage,
                      })}
                      onClick={() => goLastPage()}
                    >
                      {totalPages}
                    </button>
                  ) : null}
                  <button
                    className={classnames("page-button-np", {
                      "page-button-np-dis": currentPage === totalPages,
                    })}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next page
                  </button>
          
              </div>
              )}
              </div>
            );
            
            
  };











  export const UsersISS = (props) => {
        const itemsPerPage = 20;
        const [currentPage, setCurrentPage] = useState(1);
        const [UsersData, setUsersData] = useState({ users: [] });
        const [loading, setLoading] = useState(true);
        const [searchUser, setSearchUser] = useState('');

        useEffect(() => {
          axios.get(GetUsersUrl).then(response => {setUsersData(response['data']); setLoading(false);
          setCurrentPage(1);});
        }, []);
        
      
        let users = UsersData !== null ? UsersData['users'] : '';
      
        
        const filtered_search_user = users.filter(user => {
          return user.username.toLowerCase().includes(searchUser.toLowerCase())
        })
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        const currentItems = filtered_search_user.slice(startIndex, endIndex);
        
        const totalPages = Math.ceil(filtered_search_user.length / itemsPerPage);
        
      
        const handlePageChange = (page) => {
          if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
          }
        };
      
        const goFirstPage = () => {
          setCurrentPage(1);
        };
      
        const goLastPage = () => {
          setCurrentPage(totalPages);
        };
      
        const visiblePageCount = 3;
        const firstVisiblePage = Math.max(1, Math.min(currentPage - Math.floor(visiblePageCount / 2), totalPages - visiblePageCount + 1));
      
        const visiblePages = Array.from({ length: visiblePageCount }, (_, index) => {
          const page = firstVisiblePage + index;
      
          return page;
        }).filter((page) => page >= 1 && page <= totalPages);
      
        const isFinalPageVisible = !visiblePages.includes(totalPages);
        const isFirstPageVisible = !visiblePages.includes(1);
      
      
      
        return (
          <div>
            <div className='search-div'>
                <input
                type="text"
                className='search'
                placeholder="Search by username"
                onChange={(event) => setSearchUser(event.target.value)}
              />
              </div>
            <div className="field-div">
    
            <div className="table-div">
                    <table className='table-users'>
                        <thead>
                            <tr>
                                <th className='head-table'>ID</th>
                                <th className='head-table'>Username</th>
                                <th className='head-table'>Email</th>
                                <th className='head-table'>Access Level</th>
                                <th className='head-table'>Field</th>
       
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user, index) => (
                                <tr key={index} className='row-table'>
                                    <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.id_user}</td>
                                    <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.username}</td>
                                    <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.email}</td>
                                    <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.access_level}</td>
                                    <td className={index % 2 === 0 ? 'element-table' : 'element-table2'}>{user.field}</td>
            
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
                   {!loading &&(<div className="pagination-div">
                      <button
                        className={classnames("page-button-np", {
                          "page-button-np-dis": currentPage === 1,
                        })}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous page
                      </button>
                      {isFirstPageVisible ? (
                        <button
                          className={classnames("page-button-ff page-button-f", {
                            "active-page": currentPage === 1,
                          })}
                          onClick={() => goFirstPage()}
                        >
                          1
                        </button>
                      ) : null}
              
                      {visiblePages.map((page) => (
                        <button
                          className={classnames("page-button", {
                            "active-page": page === currentPage,
                          })}
                          key={page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                      {isFinalPageVisible ? (
                        <button
                          className={classnames("page-button-ff", {
                            "active-page": totalPages === currentPage,
                          })}
                          onClick={() => goLastPage()}
                        >
                          {totalPages}
                        </button>
                      ) : null}
                      <button
                        className={classnames("page-button-np", {
                          "page-button-np-dis": currentPage === totalPages,
                        })}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next page
                      </button>
              
                  </div>
                  )}
                  </div>
                );
                
            
  };