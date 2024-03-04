import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import axios from 'axios';
import '../styles/documents.css';
import '../styles/document_item.css';
import {postGetDocumentUrl } from '../const_urls';

 
 
 

export const DocumentInfo = (props) => {
 
  const [DocumentData, setDocumentData] = useState({document_one: []});
  useEffect(() => {
    axios.get(postGetDocumentUrl).then(response => {setDocumentData(response['data']);  });
  }, []);

  let document_one = DocumentData !== null ? DocumentData['document_one'] : '';
  let pdf = DocumentData !== null ? DocumentData['pdf'] : '';


  return (
    <div>


      <div  className='docinfo-div'>

        <div>
            <p className='docinfo'>Name: {document_one.name}</p>
        </div>
        <div>
            <p className='docinfo'>Owner: {document_one.owner}</p>
        </div>
        <div>
            <p className='docinfo'>Description: {document_one.description}</p>
        </div>
        <div>
            <p className='docinfo'>Upload date: {document_one.upload_date}</p>
        </div>
        <div>
            <p className='docinfo'>Class: {document_one.secret_level}</p>
        </div>
        <div>
            <p className='docinfo'>Field: {document_one.field}</p>
        </div>
        
        </div>
        <div>
            {pdf ? (
            <embed  className = "pdf" src={"http://127.0.0.1:5000/static/uploads/" + pdf.pdf_filename} type="application/pdf" width="50%" height="900px" />
        ) : (
            <p>Загрузка PDF...</p>
        )}
        </div>
    </div>
    );
          
          
};
