import React from 'react';
import TableRow from './TableRow';
import "../../styles/Schedule.css"
import "../../styles/ServicePricing.css"
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';

interface TableComponentProps {
    columns: string[];
    columnHeaders: string[];
    data: any[];
    actions?: { label: string; icon: string; onClick: (id: number, fullName?: string, slotId?: number) => void }[]; // Actions prop
    itemsPerPage?: number;
    isKoiFishPage?: boolean;
    isAppointmentPage?: boolean;
    isAddressPage?: boolean;
    isFeedbackPage?: boolean;

}


const TableComponent: React.FC<TableComponentProps> = ({ columns, columnHeaders, data, actions, itemsPerPage = 8, isKoiFishPage, isAddressPage, isAppointmentPage, isFeedbackPage  }) => {

    const [currentPage, setCurrentPage] = useState<number>(1);
    // Calculate total pages
    const indexOfLastAddress = currentPage * itemsPerPage;
    const indexOfFirstAddress = indexOfLastAddress - itemsPerPage;
    const currentData  = data.slice(indexOfFirstAddress, indexOfLastAddress)

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
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

                {currentData.map((item) => (
                        <TableRow
                            key={item[columns[0]]} // Assuming first column is ID
                            columns={columns}
                            rowData={item}
                            actions={actions} // Pass actions prop // Pass actions prop
                            isKoiFishPage={isKoiFishPage} // Truyền prop vào đây
                            isAddressPage={isAddressPage} // Truyền prop vào đây
                            isAppointmentPage={isAppointmentPage} // Truyền prop vào đây
                            isFeedbackPage={isFeedbackPage} // Truyền prop vào đây
                        />
                ))}

                </tbody>
            </table>
            <Pagination
                count={Math.ceil(data.length / itemsPerPage)} // Total pages
                shape="rounded"
                page={currentPage} // Current page
                onChange={handlePageChange} // Page change handler
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }} // Center the pagination
            />

        </div>
    );
};

export default TableComponent;
