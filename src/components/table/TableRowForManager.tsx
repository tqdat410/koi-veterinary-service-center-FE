import React from 'react';

interface Action {
    label: string;
    onClick: (id: number, fullName?: string) => void; // Updated to accept fullName as an optional parameter
    icon?: string; // Optional icon property for actions
}

interface TableRowProps {
    columns: string[];
    rowData: any;
    actions?: Action[]; // Hành động
    isKoiFishPage?: boolean; // Thêm prop để xác định trang
    isAddressPage?: boolean; // Thêm prop để xác định trang
    isAppointmentPage?: boolean; // Thêm prop để xác định trang
    isFeedbackPage?: boolean; // Thêm prop để xác định trang
}

// Function to format DateTime
const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    
    return date.toLocaleString('en-GB', options);
};

    const TableRow: React.FC<TableRowProps> = ({ columns, rowData, actions = [], isKoiFishPage, isAddressPage, isAppointmentPage, isFeedbackPage }) => {
       
    const fullName = `${rowData.first_name || rowData.name} ${rowData.last_name || ''}`.trim(); // Tạo fullName
   
    return (
        <tr>
            {columns.map((column) => (
                <td key={column}>
                    {column === 'fullName' ? (
                        <div className="d-flex justify-content-center align-items-center">
                            {/* <img
                                src={rowData.avatar}
                                alt={fullName}
                                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: '1rem' }}
                            /> */}
                            {/* Lỗi avatar nên chưa để vào */}
                            {fullName}
                        </div>
                    ) : column === 'datetime' ? (
                        <div>{rowData.created_date}</div> // Format datetime column
                    ) : (
                        !rowData[column] ? 'N/A' : rowData[column]
                    )}
                </td>
            ))}
            <td>
                {actions.length > 0 ? (
                    <div className="dropdown ms-auto">
                        <i className="fas fa-ellipsis-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                        <ul className="dropdown-menu dropdown-menu-end" >
                            {actions.map((action, index) => (
                                <li key={index}>
                                    <span className="dropdown-item" onClick={() => {

                                        const id = isKoiFishPage ? rowData.fish_id : isAddressPage ? rowData.address_id : isAppointmentPage ? rowData.appointment_id : isFeedbackPage ? rowData.feedback_id : rowData.user_id; // Lấy id tương ứng
                                        action.onClick(id, fullName); // Pass fullName as an argument
                                    }

                                    }>

                                        {action.icon && <i className={`${action.icon} mx-2`}></i>}
                                        {action.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <button
                        onClick={() => console.log("View ")}
                        className="btn btn-primary btn-sm"
                        
                    >
                        View
                    </button>
                )}
            </td>
        </tr>
    );
};

export default TableRow;
