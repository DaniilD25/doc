import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import axios from 'axios';
import '../styles/documents.css';
import '../styles/my_documents.css';
import { GetMyDocumentsUrl, DeleteDocumentUrl, postGetDocumentUrl,UpdateDocumentUrl,CreateDocumentUrl,postInvisibilityUrl } from '../const_urls';
import { Formik, Form, Field } from 'formik';
 
const DocumentElement = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [invisibility, setInvisibility] = useState(props.invisibility);

  const postInvisibility = (check, document) => {
      axios.post(postInvisibilityUrl, { id_document: document, invisibility: check })
          .then(response => {
              console.log('Успешный запрос', response);
              // Обновляем состояние invisibility при успешном запросе
              setInvisibility(check ? "yes" : "no");
          })
          .catch(error => {
              console.error('Ошибка запроса', error);
          });
  };

  return (
      <div className='my-document-back'>
          <div className='my-document-back2' onClick={props.onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <div>
                  {isHovered ? (
                      <div>
                          <p className='my-document-info2'>Document information</p>
                          <p className='my-document-info'>{props.description}</p>
                      </div>
                  ) : (
                      <>
                          <p className='my-document'> Name: {props.docname}</p>
                          <p className='my-document'>Field: {props.docfield}</p>
                          <p className='my-document'>Class: {props.docclass}</p>
                      </>
                  )}
              </div>
          </div>
          <div className='my-documents-buttons-div'>
              <button type="button" className="btn btn-success buttons-div" onClick={() => props.openUpdateDialog()}>Change document</button>
              <button type="button" className="btn btn-danger buttons-div" onClick={() => props.openDeleteDialog()}>Delete document</button>
              <p className='classInv'>Invisibility</p>
              <label className="doc-checkbox" htmlFor={props.document_id}>
                  <input
                      type='checkbox'
                      id={props.document_id}
                      className={classnames("doc-checkbox_inp ")}
                      checked={invisibility === "yes" ? true : false}
                      onChange={(event) => {
                          const isChecked = event.target.checked;
                          postInvisibility(isChecked, props.document_id);
                      }}
                  >
                  </input>
                  <span className="doc-checkbox_label"></span>
              </label>
          </div>
      </div>
  );
};


  const Label = (props) => {
    
  
    return (
        <div className='label-name-div'>
        <p className='label-name'>{props.label}: {props.field} </p>
        </div>
    );
  };


export const MyDocuments = (props) => {

  const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  
  const [UpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [documentToUpdate, setDocumentToUpdate] = useState(null);

  const [AddDialogOpen, setAddDialogOpen] = useState(false);
  const [documentToAdd, setDocumentToAdd] = useState(null);

  const [formUpdateSubmitted, setFormUpdateSubmitted] = useState(false);
  const [formAddSubmitted, setFormAddSubmitted] = useState(false);
  const [formDeleteSubmitted, setFormDeleteSubmitted] = useState(false);

  const [secretLevel, setSecretLevel] = useState("");
  const [file, setFile] = useState(null);
  const [secretClassTestValue, setSecretClassTestValue] = useState(false);


  const [passwordType, setPasswordType] = useState('password');
  const EyeChange = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };




  const openDeleteDialog = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setDocumentToDelete(null);
    setDeleteDialogOpen(false);
  };
  


  const openUpdateDialog = (document) => {
    setDocumentToUpdate(document);
    setSecretLevel(document.secret_level);
    setUpdateDialogOpen(true);
  };
  
  const closeUpdateDialog = () => {
    setDocumentToUpdate(null);
    setSecretLevel("");
    setFile(null);
    setUpdateDialogOpen(false);
    setFormUpdateSubmitted(false);
  };



  const openAddDialog = () => {
    setDocumentToAdd(1);
    setAddDialogOpen(true);
  };
  
  const closeAddDialog = () => {
    setDocumentToAdd(null);
    setSecretLevel("");
    setFile(null);
    setSecretClassTestValue(false);
    setSelectClassClick(null);
    setAddDialogOpen(false);
    setFormAddSubmitted(false);
  };


  const ErrorFuncUpdate = () => {
    setFormUpdateSubmitted(true);
  
  };

  const ErrorFuncAdd = () => {
    setFormAddSubmitted(true);
  };

  const handleDeleteDocument= () => {
    axios.post(DeleteDocumentUrl, { id_document: documentToDelete.id_document})
      .then(response => {
        console.log('Успешный запрос', response);
        closeDeleteDialog();
      })
      .catch(error => {
        console.error('Ошибка запроса', error);
        closeDeleteDialog();
      });
  };


  const itemsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchDocument, setSearchDocument] = useState('');
  const [selectedClasses, setSelectedClasses] = useState(new Set());
  const [SelectedSolution, setSelectClassClick] = useState(null);
  const [MyDocumentsData, setMyDocumentsData] = useState({my_documents: []});
  useEffect(() => {
    axios.get(GetMyDocumentsUrl).then(response => {setMyDocumentsData(response['data']);setLoading(false);  });
  }, [documentToDelete, documentToUpdate,documentToAdd, currentPage,]);




  let my_documents = MyDocumentsData !== null ? MyDocumentsData['my_documents'] : '';
  const filtered_search_field = my_documents.filter(document => {
    return document.name.toLowerCase().includes(searchDocument.toLowerCase())
  })
  const toggleClass = (className) => {
    const newSelectedClasses = new Set(selectedClasses);
    if (newSelectedClasses.has(className)) {
      newSelectedClasses.delete(className);
    } else {
      newSelectedClasses.add(className);
    }
    setSelectedClasses(newSelectedClasses);
  };

  const filteredDocuments = filtered_search_field.filter(document => {
    // Фильтрация по имени
    const nameDocument = document.name.toLowerCase().includes(searchDocument.toLowerCase());
    // Фильтрация по выбранным классам
    const classDocuments = selectedClasses.size === 0 || selectedClasses.has(document.secret_level);
    return nameDocument && classDocuments;
  });






  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentItems = filteredDocuments.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  

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

  function showResult() {
    const answers = document.querySelectorAll('input[type=radio]:checked');
  
    let hasVeryConfidential = false;
    let hasConfidential = false;
    let hasForInternalUse = false;
    let hasPublic = false;
  
    answers.forEach(answer => {
      if (answer.value === 'VeryConfidential') {
        hasVeryConfidential = true;
      } else if (answer.value === 'Confidentially') {
        hasConfidential = true;
      } else if (answer.value === 'ForInternalUse') {
        hasForInternalUse = true;
      } else if (answer.value === 'Public') {
        hasPublic = true;
      }
    });
  
    if (hasVeryConfidential) {
      setSecretClassTestValue(true);
      return 'D';
    } else if (hasConfidential) {
      setSecretClassTestValue(true);
      return 'C';
    } else if (hasForInternalUse) {
      setSecretClassTestValue(true);
      return 'B';
    } else if (hasPublic) {
      setSecretClassTestValue(true);
      return 'A';
    } else {
      return ''; // Default value if no options are selected
    }
  }
  

  return (
    <div>
        <div className='label-name-div'>
        <p className='label-name'>My documents</p>
        </div>
        <div className='upload-button-div'>
          <button type="button" className="btn btn-warning " onClick={openAddDialog}>Upload document</button>
        </div>
  
        <div className='search-div'>
          <input
          type="text"
          className='search'
          placeholder="Search by document name"
          onChange={(event) => setSearchDocument(event.target.value)}
        />
        </div>
        <div className='toggle_div'>
                <label class="checkbox" for="checkbox_A">
                  <input type='checkbox'  id="checkbox_A" className={classnames("checkbox_inp ")} onChange={() => toggleClass("A")}></input>
                  <span className="checkbox_label">
                  </span>
                </label>
                <p className='classSecret'>A</p>
                <label class="checkbox" for="checkbox_B">
                  <input type='checkbox'  id="checkbox_B" className={classnames("checkbox_inp")} onChange={() => toggleClass("B")}></input>
                  <span className="checkbox_label">
                  </span>
                </label>
                <p className='classSecret'>B</p>
                <label class="checkbox" for="checkbox_C">
                  <input type='checkbox'  id="checkbox_C" className={classnames("checkbox_inp")} onChange={() => toggleClass("C")}></input>
                  <span className="checkbox_label">
                  </span>
                </label>
                <p className='classSecret'>C</p>
                <label class="checkbox" for="checkbox_D">
                  <input type='checkbox'  id="checkbox_D" className={classnames("checkbox_inp")} onChange={() => toggleClass("D")}></input>
                  <span className="checkbox_label">
                  </span>
                </label>
                <p className='classSecret'>D</p>
      </div>
      <div className="field-div">
      
     
    {currentItems.map((document, index) => {
        const handleDocumentClick = () => {
            axios.post(postGetDocumentUrl, { id_document: document.id_document})
              .then(response => {
                console.log('Успешный запрос', response);
                props.clickDocument()
              })
              .catch(error => {
                console.error('Ошибка запроса', error);
              });
            };
   
          return (
             <DocumentElement
              docname = {document.name}
              document_id = {document.id_document}
              description = {document.description}
              docfield = {document.field}
              docclass = {document.secret_level}
              invisibility = {document.invisibility}
              openUpdateDialog={() => openUpdateDialog(document)}
              openDeleteDialog={() => openDeleteDialog(document)}
              key={index} onClick={handleDocumentClick}
              />

          );
          
        })}
        </div>
        {DeleteDialogOpen && (
            <div className="confirmation-dialog">
              <div>
                <a>Are you sure you want to delete the document?</a>
              </div>
              <div className='buttons-dialog'>
                <button className='btn btn-success delete-dialog' onClick={handleDeleteDocument}>Confirm deletion</button>
                <button className='btn btn-danger delete-dialog' onClick={closeDeleteDialog}>Cancel</button>
              </div>
            </div>
          )}
        {UpdateDialogOpen && (
            <div className="confirmation-dialog-documents">
              <div>
                
                <Formik
                initialValues={{
                  id_document: documentToUpdate.id_document,
                  name: documentToUpdate.name,
                  field: documentToUpdate.field,
                  description: documentToUpdate.description,
                  secret_level: documentToUpdate.secret_level,
                  pdf: file,
                  password: "",

                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.name) {
                    errors.name = 'Данное поле должно быть заполнено';
                  }
                  if (!values.field) {
                    errors.field = 'Данное поле должно быть заполнено';
                  }
                  if (!values.description) {
                    errors.description = 'Данное поле должно быть заполнено';
                  }
                  if (!values.secret_level) {
                    errors.secret_level = 'Данное поле должно быть заполнено';
                  }
                  if (!values.password && (secretLevel == 'C' || secretLevel == 'D') && file) {
                    errors.password = 'Данное поле должно быть заполнено';
                  }
                  
                  return errors;
                }}
                

                onSubmit={(values, { setSubmitting }) => {

                  const formData = new FormData();
                  formData.append('id_document', documentToUpdate.id_document);
                  formData.append('secret_level', values.secret_level);
                  console.log('CLASS', values.secret_level)
                  formData.append('name', values.name);
                  formData.append('field', values.field);
                  formData.append('description', values.description);
                  formData.append('pdf', file);
                  formData.append('password', values.password);
                  axios.post(UpdateDocumentUrl, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  })
                  .then((response) => {
                    console.log('Документ успешно обновлен', response);
                    closeUpdateDialog();
                  
                  })
                  .catch((error) => {
                    console.error('Ошибка при обновлении команды', error);

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
                        <div className="label-auto">Changing document data</div>
                      </div>

                      <div className="label-login-div">
                        <label className="label-login">Document name</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="name" 
                        name="name" 
                        className={`field-write-2 form-login ${errors.name && formUpdateSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>
                      {formUpdateSubmitted && errors.name && touched.name && (
                        <div className="error-2">{errors.name}</div>
                      )}




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


                      <div className="label-login-div">
                        <label className="label-login">Description</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        as="textarea"
                        id="description" 
                        name="description" 
                        className={`field-write-2 form-desc ${errors.name && formUpdateSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>
                      {formUpdateSubmitted && errors.description && touched.description && (
                        <div className="error-2">{errors.description}</div>
                      )}


                      <div className="label-login-div">
                        <label className="label-login">Secret level</label>
                      </div>
                      <div className="form-login-div">
                      <Field
                        as="select"
                        id="secret_level"
                        name="secret_level"
                        value={values.secret_level} 
                        onChange={(event) => {
                          setSecretLevel(event.target.value);
                          setFieldValue('secret_level', event.target.value);
                        }}
                        className={`field-write-2 form-login ${errors.secret_level && formUpdateSubmitted ? 'field-error-2' : ''}`}
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
                        <label className="label-login">File</label>
                      </div>
                      <div className="form-login-div photo-chose-div">
                      <input 
                        type="file" 
                        id="pdf"
                        name="pdf"
                        accept=".pdf" 
                        onChange={(event) => {
                          setFieldValue('pdf', event.currentTarget.files[0]);
                          setFile(event.currentTarget.files[0]);
                        }}
                        
                      />

                      </div>
                      {formUpdateSubmitted && errors.pdf && touched.pdf && (
                        <div className="error-2">{errors.pdf}</div>
                      )}
                      {((secretLevel === "C" || secretLevel === "D") && file) && (
                        <div>
                        <div className="label-login-div">
                        <label className="label-login">Password for file</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="password" 
                        name="password" 
                        type={passwordType} 
                        className={`field-write form-login form-password ${errors.password && formUpdateSubmitted ? 'field-error-2' : passwordType == "password" ? 'points' : ''}`} 
                        placeholder="Enter password "
                        />
                        <img className = {'eye'}
                                  src={require(passwordType === 'password' ? '../imgs/eye.png' : '../imgs/eye-off.png')}
                                  alt="Your Image"
                                  onClick={EyeChange}
                                />
                      </div>
                      {formUpdateSubmitted && errors.password && touched.password && (
                          <div className="error-2">{errors.password}</div>
                        )}
                       </div>
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
          {AddDialogOpen && (
            <div className="confirmation-dialog-documents-upload">
              <div>
                <Formik
                initialValues={{
                  id_document: null,
                  name: null,
                  field: null,
                  description: null,
                  secret_level: null,
                  pdf: null,
                  password: "",
                  secret_class_test: null,
                }}
                validate={(values) => {
                  const errors = {};
                
                  if (!values.name) {
                    errors.name = 'Данное поле должно быть заполнено';
                  }
                  if (!values.field ) {
                    errors.field = 'Данное поле должно быть заполнено';
                  }
                  if (!values.description) {
                    errors.description = 'Данное поле должно быть заполнено';
                  }
                  if (!values.secret_level && SelectedSolution === 2) {
                    errors.secret_level = 'Данное поле должно быть заполнено';
                  }
                  if (!file) {
                    errors.pdf = 'Файл должен быть!';
                  }
                  if (!values.password && (secretLevel == 'C' || secretLevel == 'D') && file) {
                    errors.password = 'Данное поле должно быть заполнено';
                  }
                  if (!secretClassTestValue && SelectedSolution === 1) {
                    errors.secret_class_test = 'Надо нажать на кнопку!';
                  }
                  return errors;
                }}
                

                onSubmit={(values, { setSubmitting }) => {

                  const formData = new FormData();
                  formData.append('secret_level', values.secret_level);
                  formData.append('secret_level_test', values.secret_class_test);
                  formData.append('name', values.name);
                  formData.append('field', values.field);
                  formData.append('description', values.description);
                  formData.append('pdf', file);
                  formData.append('password', values.password);
                  axios.post(CreateDocumentUrl, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  })
                  .then((response) => {
                    console.log('Документ успешно обновлен', response);
                    closeAddDialog();
                  
                  })
                  .catch((error) => {
                    console.error('Ошибка при обновлении команды', error);

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
                        <div className="label-auto">Create document data and upload</div>
                      </div>

                      <div className="label-login-div">
                        <label className="label-login">Document name</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="name" 
                        name="name" 
                        className={`field-write-2 form-login ${errors.name && formAddSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>
                      {formAddSubmitted && errors.name && touched.name && (
                        <div className="error-2">{errors.name}</div>
                      )}




                      <div className="label-login-div">
                        <label className="label-login">Field</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="field" 
                        name="field" 
                        className={`field-write-2 form-login ${errors.name && formAddSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>
                      {formAddSubmitted && errors.field && touched.field && (
                        <div className="error-2">{errors.field}</div>
                      )}


                      <div className="label-login-div">
                        <label className="label-login">Description</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        as="textarea"
                        id="description" 
                        name="description" 
                        className={`field-write-2 form-desc ${errors.name && formAddSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>
                      {formAddSubmitted && errors.description && touched.description && (
                        <div className="error-2">{errors.description}</div>
                      )}

                      <div className="label-login-div">
                        <label className="label-login">File</label>
                      </div>
                      <div className="form-login-div photo-chose-div">
                      <input 
                        type="file" 
                        id="pdf"
                        name="pdf"
                        accept=".pdf" 
                        onChange={(event) => {
                          setFieldValue('pdf', event.currentTarget.files[0]);
                          setFile(event.currentTarget.files[0]);
                        }}
                      />

                      </div>
                      {formAddSubmitted && errors.pdf && touched.pdf && (
                        <div className="error-2">{errors.pdf}</div>
                      )}


                      <div className="label-login-div">
                        <label className="label-login">Will you determine the security class of the document yourself?</label>
                      </div>
                      <div className="form-radio-div">
                        <div className="radio-labels">
                          <label className='label-radio' htmlFor="no">No</label>
                          <label className='label-radio' htmlFor="yes">Yes</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="no"
                            name="secretLevelChoice"
                            value="no" 
                            className='radio-secret'
                            onClick={() => {
                              setSelectClassClick(1);
                              setFieldValue("secret_level", "");
                            }}
                          />
                           <input 
                            type="radio" 
                            id="yes"
                            name="secretLevelChoice"
                            value="yes" 
                            className='radio-secret'
                            onClick={() => {
                              setSelectClassClick(2);
                              setFieldValue("secret_class_test", "");
                              document.querySelectorAll('input[type="radio"][name="question_1"]').forEach((radio) => {
                                radio.checked = false;
                            });
                              document.querySelectorAll('input[type="radio"][name="question_2"]').forEach((radio) => {
                                radio.checked = false;
                            });
                              document.querySelectorAll('input[type="radio"][name="question_3"]').forEach((radio) => {
                                radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_4"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_5"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_6"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_7"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_8"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_9"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_10"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_11"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_12"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_13"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_14"]').forEach((radio) => {
                              radio.checked = false;
                            });
                            document.querySelectorAll('input[type="radio"][name="question_15"]').forEach((radio) => {
                              radio.checked = false;
                             });
                            }}
                          />
                        </div>
                      </div>
                      {formAddSubmitted && SelectedSolution === null &&  (
                        <div className="error-2">Надо выбрать один из вариантов!</div>
                      )}
                      {(SelectedSolution === 1) && (
                        <div>
                        <div className="label-login-div">
                          <label className="label-login">Take the test</label>
                        </div>


                        {/* Вопрос 1 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">1.Информация, содержащаяся в документах была уже классифицирована с точки зрения конфиденциальности руководитлем,
                          вышестоящим подразделением или отделом по корпоративным коммуникуциям? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-answer' htmlFor="VeryConfidential_1">Very confidential</label>
                          <label className='label-answer' htmlFor="Confidentially_1">Confidentially</label>
                          <label className='label-answer' htmlFor="ForInternalUse_1">For internal use</label>
                          <label className='label-answer' htmlFor="Public_1">Public</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="VeryConfidential_1"
                            name="question_1"
                            value="VeryConfidential" 
                            className='radio-secret'
           
                             
                          />
                           <input 
                            type="radio" 
                            id="Confidentially_1"
                            name="question_1"
                            value="Confidentially" 
                            className='radio-secret'
                       
                          />
                          <input 
                            type="radio" 
                            id="ForInternalUse_1"
                            name="question_1"
                            value="ForInternalUse" 
                            className='radio-secret'
                      
                          />
                           <input 
                            type="radio" 
                            id="Public_1"
                            name="question_1"
                            value="Public" 
                            className='radio-secret'
                          />
                        </div>
                      </div>

                        {/* Вопрос 2 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">2.Информация, содержащаяся в документах была полуена от источников, где классификация уже была проведена? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-answer' htmlFor="VeryConfidential_2">Very confidential</label>
                          <label className='label-answer' htmlFor="Confidentially_2">Confidentially</label>
                          <label className='label-answer' htmlFor="ForInternalUse_2">For internal use</label>
                          <label className='label-answer' htmlFor="Public_2">Public</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="VeryConfidential_2"
                            name="question_2"
                            value="VeryConfidential" 
                            className='radio-secret'
           
                             
                          />
                           <input 
                            type="radio" 
                            id="Confidentially_2"
                            name="question_2"
                            value="Confidentially" 
                            className='radio-secret'
                       
                          />
                          <input 
                            type="radio" 
                            id="ForInternalUse_2"
                            name="question_2"
                            value="ForInternalUse" 
                            className='radio-secret'
                      
                          />
                           <input 
                            type="radio" 
                            id="Public_2"
                            name="question_2"
                            value="Public" 
                            className='radio-secret'
                          />
                        </div>
                        </div>
                        {/* Вопрос 3 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">3.Информация, содержащаяся в документах подлежит строгому контролю и может быть передана только сильно ограниченному
                          кругу лиц, предварительно утвержденному обладателем информации(например, тольео участникам встречи с указанием их имен)? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="VeryConfidential_3">Very confidential</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="VeryConfidential_3"
                            name="question_3"
                            value="VeryConfidential" 
                            className='radio-for-1-answer'
                          />
                
                        </div>
                        </div>

                        {/* Вопрос 4 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">4.Информация, содержащаяся в документах может быть передана только четко определенным группам лиц, ролей
                          , исполнителей, команде проекта (например, медицинскому персоналу)? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="Confidentially_4">Confidentially</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="Confidentially_4"
                            name="question_4"
                            value="Confidentially" 
                            className='radio-for-1-answer'
                          />
                
                        </div>
                        </div>
                        {/* Вопрос 5 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">5.Информация, содержащаяся в документах может быть передана по обоснованному запросу и опрелеленной целью
                          и только после консультации с обладателем информации? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="VeryConfidential_5">Very confidential</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="VeryConfidential_5"
                            name="question_5"
                            value="VeryConfidential" 
                            className='radio-for-1-answer'
                          />
                
                        </div>
                        </div>
                        {/* Вопрос 6 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">6.Информация, содержащаяся в документах может быть передана любому человеку без ограничений (например, прохожему на улице,
                           журналистам и конкурентам)? Если НЕТ, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="ForInternalUse_6">For internal use</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="ForInternalUse_6"
                            name="question_6"
                            value="ForInternalUse" 
                            className='radio-for-1-answer'
                          />
                
                        </div>
                        </div>
                        {/* Вопрос 7 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">7.Была ли публикация согласована напрямую с отделом по корпоративным коммуникуциям? Если НЕТ, то выберите вариант "For internal use".
                          Если ДА, то выберите вариант "Public":</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="ForInternalUse_7">For internal use</label>
                          <label className='label-for-1-answer' htmlFor="Public_7">Public</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="ForInternalUse_7"
                            name="question_7"
                            value="ForInternalUse" 
                            className='radio-for-1-answer'
                          />
                          <input 
                            type="radio" 
                            id="Public_7"
                            name="question_7"
                            value="Public" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        {/* Вопрос 8 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">8.Информация, содержащаяся в документах согласно закону или корпоративным правилам должна быть выпущена
                           четко определенным образом, что исключает публикацию до определенного срока? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="VeryConfidential_8">Very confidential</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="VeryConfidential_8"
                            name="question_8"
                            value="VeryConfidential" 
                            className='radio-for-1-answer'
                          />
                
                        </div>
                        </div>
                        {/* Вопрос 9 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">9.Если на предыдущий вопрос ответ "НЕТ", то ответьте на этот вопрос. Информация, содержащаяся в документах согласно закону или корпоративным правилам должна быть выпущена
                           четко определенным образом, значительно ограничивающим круг лиц, которым данная информация передается (данные о выбросах вредных веществ, данные по 
                           окружающей среде)? Если ДА, то выберите "Confidentially". Если НЕТ, то выберите "For internal use"</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="ForInternalUse_9">For internal use</label>
                          <label className='label-for-1-answer' htmlFor="Confidentially_9">Confidentially</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="ForInternalUse_9"
                            name="question_9"
                            value="ForInternalUse" 
                            className='radio-for-1-answer'
                          />
                          <input 
                            type="radio" 
                            id="Confidentially_9"
                            name="question_9"
                            value="Confidentially" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        {/* Вопрос 10 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">10.Информация, содержащаяся в документах должна быть передана непосредственно Обладателем информации? Публикации
                          третьих лиц распространяются и подтверждаются Обладателем информации? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="VeryConfidential_10">Very confidential</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="VeryConfidential_10"
                            name="question_10"
                            value="VeryConfidential" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        {/* Вопрос 11 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">11.Информация, содержащаяся в документах включает персональные данные, требующие особенной защиты (например, 
                          сведения о здоровье, вероисповедании)? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="VeryConfidential_11">Very confidential</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="VeryConfidential_11"
                            name="question_11"
                            value="VeryConfidential" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        {/* Вопрос 12 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">12.Информация, содержащаяся в документах включает сведения о ролях в компании, группах персонала, должностных обязанностях, инструкциях? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="Confidentially_12">Confidentially</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="Confidentially_12"
                            name="question_12"
                            value="Confidentially" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        {/* Вопрос 13 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">13.Информация, содержащаяся в документах включает сведения о 
                          корпоративных адресах и контактах, например, электронной почте, факсах, внутренних телефоных номерах, отделе, адресе компании, логине,
                          центре затрат, табельном номере? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="ForInternalUse_13">For internal use</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="ForInternalUse_13"
                            name="question_13"
                            value="ForInternalUse" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        {/* Вопрос 14 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">14.Информация, содержащаяся в документах подобна сведениям в телефонных справочниках, например имя, 
                          домашний адрес и номера личных телефонов клиентов и работников? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="Confidentially_14">Confidentially</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="Confidentially_14"
                            name="question_14"
                            value="Confidentially" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        {/* Вопрос 15 */}
                        <div className='backQuestion'>
                        <div className="label-login-div">
                          <label className="label-question">15.Информация, содержащаяся в документах получена из обсуждений и соглашений между непосредственным руководитлем
                          и подчиненым (например, соглашение по целям, план развития)? Если ДА, то выберите вариант:</label>
                        </div>
                        <div className="radio-labels">
                          <label className='label-for-1-answer' htmlFor="Confidentially_15">Confidentially</label>
                        </div>
                        <div className="radio-buttons">
                          <input 
                            type="radio" 
                            id="Confidentially_15"
                            name="question_15"
                            value="Confidentially" 
                            className='radio-for-1-answer'
                          />
                        </div>
                        </div>
                        <div className='get_result_test-div'>
                        <button className='btn btn-success' type="button" onClick={(event) => 
                          {setFieldValue('secret_class_test',showResult());
                          setSecretLevel(showResult());
                          }}>Get a privacy class</button>
                        </div>
                        <div className="label-login-div">
                        <label className="label-login">Secret class</label> 
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="secret_class_test" 
                        name="secret_class_test" 
                        readOnly
                        className={`field-write-2 form-login ${errors.secret_class_test && formAddSubmitted ? 'field-error-2' : ''}`}
                        />
                      </div>

                        </div>
                      )}



















                      {(SelectedSolution === 2) && (
                        <div>
                        <div className="label-login-div">
                          <label className="label-login">Secret level</label>
                        </div>
                        <div className="form-login-div">
                        <Field
                          as="select"
                          id="secret_level"
                          name="secret_level"
                          value={values.secret_level} 
                          onChange={(event) => {
                            setSecretLevel(event.target.value);
                            setFieldValue('secret_level', event.target.value);
                          }}
                          className={`field-write-2 form-login ${errors.secret_level && formAddSubmitted ? 'field-error-2' : ''}`}
                        >

                                <option value="">
                                  Select class 
                                </option>
                                <option key={2} value="A">
                                  A (Public)
                                </option>
                                <option key={3} value="B">
                                  B (For internal use)
                                </option>
                                <option key={4} value="C">
                                  C (Confidentially)
                                </option>
                                <option key={5} value="D">
                                  D (Very confidential)
                                </option>
                          </Field>
                        </div>
                        {formAddSubmitted && errors.secret_level && (
                          <div className="error-2">{errors.secret_level}</div>
                        )}
                        </div>
                      )}

                      {((secretLevel === "C" || secretLevel === "D") && file) && (
                        <div>
                        <div className="label-login-div">
                        <label className="label-login">Password for file</label>
                      </div>
                      <div className="form-login-div">
                        <Field 
                        id="password" 
                        name="password" 
                        type={passwordType} 
                        className={`field-write form-login form-password ${errors.password && formAddSubmitted ? 'field-error-2' : passwordType == "password" ? 'points' : ''}`} 
                        placeholder="Enter password "
                        />
                        <img className = {'eye'}
                                  src={require(passwordType === 'password' ? '../imgs/eye.png' : '../imgs/eye-off.png')}
                                  alt="Your Image"
                                  onClick={EyeChange}
                                />
                      </div>
                      {formAddSubmitted && errors.password && touched.password && (
                          <div className="error-2">{errors.password}</div>
                        )}
                       </div>
                      )}

                      <div className='buttons-dialog'>
                        <button className='btn btn-success delete-dialog' type="submit" onClick={ErrorFuncAdd}>Upload</button>
                        <button className='btn btn-danger delete-dialog' onClick={closeAddDialog}>Cancel</button>
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
