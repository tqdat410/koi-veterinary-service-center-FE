import React from 'react';
import TableRow from './TableRowForManager';
import "../../styles/Schedule.css"
import "../../styles/ServicePricing.css"

import { useState } from 'react';

interface TableComponentProps {
    columns: string[];
    columnHeaders: string[];
    data: any[];
    actions?: { label: string; icon: string; onClick: (id: number, fullName?: string, slotId?: number) => void }[]; // Actions prop
    isKoiFishPage?: boolean; // Thêm prop
    isAppointmentPage?: boolean; // Thêm prop
    isAddressPage?: boolean; // Thêm prop
    isFeedbackPage?: boolean; // Thêm prop
    rowsPerPage?: number; // Optional prop for rows per page
} // Define the TableComponentProps interface


const TableComponent: React.FC<TableComponentProps> = ({ columns, columnHeaders, data, actions, isKoiFishPage, isAddressPage, isAppointmentPage, isFeedbackPage ,  rowsPerPage = 5 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    // Tính toán số trang
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Xác định dữ liệu nào sẽ được hiển thị trên trang hiện tại
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Thay đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="table-responsive">

            <table className="table table-bordered table-small table-small-auto table-striped">

                <thead className="table-light">
                    <tr>
                        {columnHeaders.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                        {/* <th></th> */}
                        <th></th> {/* Actions column with padding and custom width */}
                    </tr>                    
                </thead>
                <tbody>

                    {paginatedData.map((item) => (
                        <TableRow
                            key={item[columns[0]]} // Assuming first column is ID
                            columns={columns}
                            rowData={{
                                ...item
                                // datetime: formatDateTime(item.date_time) // Format DateTime column
                            }}
                            actions={
                                
                                actions?.map((action) => ({
                                    ...action,
                                    onClick: () => action.onClick(item[columns[0]], item.full_name, item.slot_id) // Assuming first column is ID
                                }))
                            } // Pass actions prop
                            isKoiFishPage={isKoiFishPage} // Truyền prop vào đây
                            isAddressPage={isAddressPage} // Truyền prop vào đây
                            isAppointmentPage={isAppointmentPage} // Truyền prop vào đây
                            isFeedbackPage={isFeedbackPage} // Truyền prop vào đây
                        />
                    ))}

                </tbody>
            </table>

            {/* Phân trang */}
            <nav aria-label="Page navigation" style={{ marginTop: '20px' }}>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default TableComponent;
