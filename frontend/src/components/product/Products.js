import React from 'react'
import { Link } from 'react-router-dom'

const Products = ({ product, col }) => {
  return (
    <div className={`col-sm-12 col-md-6 col-lg-3 my-3`} key={product._id}>
      <div className="card p-4 rounded">
        <Link to={`/product/${product._id}`}>
          <img
            className="card-img-top"
            src={product.images[0].image}
            alt={product.name}
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h5>
          <div className="ratings mt-auto">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(product.ratings / 5) * 100}%` }}
              ></div>
            </div>
            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
          </div>
          <p className="card-text">${product.price.toFixed(2)}</p>
          <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Products
