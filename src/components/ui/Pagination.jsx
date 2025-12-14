import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  
  // Calculate page numbers to show
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)
  
  // Adjust if we're near the start or end
  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages)
  }
  if (currentPage >= totalPages - 2) {
    startPage = Math.max(totalPages - 4, 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      {/* Previous button */}
      <button
        className={`pagination__btn pagination__btn--prev ${currentPage === 1 ? 'pagination__btn--disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹ Anterior
      </button>

      {/* First page and ellipsis */}
      {startPage > 1 && (
        <>
          <button
            className="pagination__btn"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {startPage > 2 && <span className="pagination__ellipsis">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map(page => (
        <button
          key={page}
          className={`pagination__btn ${currentPage === page ? 'pagination__btn--active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Last page and ellipsis */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination__ellipsis">...</span>}
          <button
            className="pagination__btn"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        className={`pagination__btn pagination__btn--next ${currentPage === totalPages ? 'pagination__btn--disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente ›
      </button>
    </div>
  )
}

export default Pagination
