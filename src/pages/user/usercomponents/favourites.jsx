import React from 'react'
import {FavoriteCardList} from './favouriteCardList'
import Navbar from './navbar'

function Favourites() {
  return (
    <div>
    <div className="navbar-invoice">
    <Navbar/>
    </div>
    <div>
      <FavoriteCardList/>
    </div>
    </div>
  )
}

export default Favourites
