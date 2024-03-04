import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import axios from 'axios';
import '../styles/documents.css';
import { postGetFieldUrl, postGetDocumentUrl } from '../const_urls';

 
const DocumentElement = (props) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className='document-back'>
        <div className='document-back2'  onClick={props.onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div>
          {isHovered ? (
            <div>
                <p className='document-info2'>Document information</p>
                <p className='document-info'>{props.description}</p>

            </div>
            ) : (
                <>
                    <p className='document'> Name: {props.docname}</p>
                    <p className='document'>Field: {props.docfield}</p>
                    <p className='document'>Class: {props.docclass}</p> 
                </>
            
            )}

          </div>
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


export const FieldDocuments = (props) => {

  const itemsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchDocument, setSearchDocument] = useState('');
  const [selectedClasses, setSelectedClasses] = useState(new Set());
  const [FieldData, setFieldData] = useState({field_one: []});
  useEffect(() => {
    axios.get(postGetFieldUrl).then(response => {setFieldData(response['data']);setLoading(false);  });
  }, []);




  let field_one = FieldData !== null ? FieldData['field_one'] : '';
  let field_name = '';
  if (field_one.length > 0) {
    field_name = field_one.every(document => document.field ===  field_one[0].field) ? field_one[0].field : 'All';
  }
  const filtered_search_field = field_one.filter(document => {
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



  return (
    <div>
        <Label 
        label="Documents"
        field ={field_name}/>
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
              description = {document.description}
              docfield = {document.field}
              docclass = {document.secret_level}
              key={index} onClick={handleDocumentClick}
              />
          );
          
        })}
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
