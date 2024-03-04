import '../styles/main.css';
import React, { useState, useEffect } from 'react';
import { postGetFieldUrl, GetFieldsUrl} from '../const_urls';
import classnames from 'classnames';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import '../styles/my_documents.css';




const NavbarElement = (props) => {
  return (
    <li className="navigation-item"  onClick={props.click}>
      <span className='nav-text' id={props.Color}>{props.text}</span>
    </li>
  );
};
export const NavigationAdminISS = (props) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <div className={`navigation ${scrolled ? 'scrolled' : ''}`}>
      <h3 className='TitleDOC'>VIRDOC</h3>
      <ul className='navigation-ul'>
        <NavbarElement
          text="Home"
          click={props.home}
          Color={props.HomeColor}
        />
        <NavbarElement
          text="My documents"
          click={props.my_documents}
          Color={props.MyDocumentsColor}
        />
        <NavbarElement
          text="Users"
          click={props.users}
          Color={props.UsersColor}
        />
        <NavbarElement
          text="Exit"
          click={props.exit}
        />
      </ul>
    </div>
  );
};
export const Navigation = (props) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <div className={`navigation ${scrolled ? 'scrolled' : ''}`}>
      <h3 className='TitleDOC'>VIRDOC</h3>
      <ul className='navigation-ul'>
        <NavbarElement
          text="Home"
          click={props.home}
          Color={props.HomeColor}
        />
        <NavbarElement
          text="My documents"
          click={props.my_documents}
          Color={props.MyDocumentsColor}
        />
        <NavbarElement
          text="Exit"
          click={props.exit}
        />
      </ul>
    </div>
  );
};


 


 
const FieldElement = (props) => {
  return (
    <div className='field-back'>
      <div className='field-back2' onClick={props.onClick}>
        <div>
          <p className='field'>{props.field_name}</p>
        </div>
      </div>
    </div>
  );
};




export const Fields = (props) => {
  const itemsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [FieldsData, setFieldData] = useState({ fields: [] });
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState('');



  useEffect(() => {
    axios.get(GetFieldsUrl).then(response => {setFieldData(response['data']); setLoading(false);
    setCurrentPage(1);});
  }, []);
  

  let fields = FieldsData !== null ? FieldsData['fields'] : '';

  const uniqueFields = fields.filter((field, index, self) => {
    // Возвращаем true, если индекс текущего элемента равен индексу первого вхождения элемента с таким же field_name
    return index === self.findIndex((t) => (
      t.field_name === field.field_name
    ));
  });
  
  const filtered_search_field = uniqueFields.filter(field => {
    return field.field_name.toLowerCase().includes(searchField.toLowerCase())
  })
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentItems = filtered_search_field.slice(startIndex, endIndex);
  
  const totalPages = Math.ceil(uniqueFields.length / itemsPerPage);
  

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

  const handleFieldAllClick = () => {
    axios.post(postGetFieldUrl, { field: 'all'})
      .then(response => {
        console.log('Успешный запрос', response);
        props.click()
      })
      .catch(error => {
        console.error('Ошибка запроса', error);
      });
    };


  return (
    <div>
      <div className='search-div'>
          <input
          type="text"
          className='search'
          placeholder="Search by field"
          onChange={(event) => setSearchField(event.target.value)}
        />
        </div>
      <div className="field-div">
      <FieldElement
              field_name = "ALL"
              onClick={handleFieldAllClick}
              />
     
    {currentItems.map((document, index) => {
        const handleFieldClick = () => {
          axios.post(postGetFieldUrl, { field: document.field_name})
            .then(response => {
              console.log('Успешный запрос', response);
              props.click()
            })
            .catch(error => {
              console.error('Ошибка запроса', error);
            });
          };
   
          return (
             <FieldElement
              field_name = {document.field_name}
              key={index} onClick={handleFieldClick}
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



 