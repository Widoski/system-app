import React from 'react'
import Pagination from '@material-ui/lab/Pagination';

export default function Paginate({ limitPerPage, total, fetch }) {

    let numberOfPages = Math.ceil(total / limitPerPage)

    const handleChange = (e, value) => {
        fetch(value);
    }

    return (
        <Pagination
            size="small"
            count={(numberOfPages)}
            onChange={handleChange}
            variant="text"
            color="primary" />
    )
}