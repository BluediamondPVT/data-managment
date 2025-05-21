import React from 'react';
import { Button } from 'react-bootstrap';

const Pagination = ({ 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    paginate 
}) => {
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calculate what to display in "Showing X to Y of Z entries"
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 5;
        
        if (totalPages <= maxPageNumbersToShow) {
            // If we have fewer pages than max to show, display all page numbers
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include first page, last page, current page and one page before and after current
            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages, currentPage + 1);
            
            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push('...');
                }
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };

    // Handle page change with scroll to top
    const handlePageChange = (pageNumber) => {
        paginate(pageNumber);
        window.scrollTo(0, 0);
    };
    
    // Don't render pagination if there's only one page or no items
    if (totalPages <= 1 || totalItems === 0) {
        return null;
    }
    
    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">
                Showing {indexOfFirstItem} to {indexOfLastItem} of {totalItems} entries
            </div>
            <nav aria-label="Customer data pagination">
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <Button 
                            variant="link" 
                            className="page-link" 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            Previous
                        </Button>
                    </li>
                    
                    {getPageNumbers().map((number, index) => (
                        <li 
                            key={index} 
                            className={`page-item ${number === currentPage ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}
                        >
                            {number === '...' ? (
                                <span className="page-link">...</span>
                            ) : (
                                <Button 
                                    variant="link" 
                                    className="page-link" 
                                    onClick={() => handlePageChange(number)}
                                    aria-label={`Page ${number}`}
                                    aria-current={number === currentPage ? "page" : null}
                                >
                                    {number}
                                </Button>
                            )}
                        </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <Button 
                            variant="link" 
                            className="page-link" 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            Next
                        </Button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;