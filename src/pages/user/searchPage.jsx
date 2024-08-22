import React from 'react';
import { CardList } from './usercomponents/userCardList';
import SearchSidebar from './usercomponents/searchsidebar';
import Navbar from './usercomponents/navbar';
import '../../style/searchpage.css';


function SearchPage() {
  return (
    <>
      <div style={{ width: '100vw' }}>
        <div className="navbar-fixed">
          <Navbar />
        </div>
      </div>
      <div className="main-content" style={{ overflowY: 'auto',marginBottom:'40px' }}>


        <div>
          <SearchSidebar />
        </div>
        <div style={{ marginLeft: '130px' }}>
          <CardList showMore={false} /> 
        </div>
      </div>
    </>
  );
}

export default SearchPage;
