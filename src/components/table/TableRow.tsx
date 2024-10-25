import React from 'react';
import defaultImage from "../../assets/images/defaultImage.jpg"
import "../../styles/TableComponent.css" // Import the TableComponent.css file

interface Action {
    label: string;
    onClick: (id: number, fullName?: string) => void;
    icon?: string;
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

const TableRow: React.FC<TableRowProps> = ({ columns, rowData, actions = [], isKoiFishPage, isAddressPage, isAppointmentPage, isFeedbackPage }) => {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'CANCELLED': return 'status-cancelled';
            case 'CHECKED_IN': return 'status-checked-in';
            case 'CONFIRMED': return 'status-confirmed';
            case 'DONE': return 'status-done';
            case 'ON_GOING': return 'status-on-going';
            case 'PENDING': return 'status-pending';
            case 'PAID': return 'status-paid';
            case 'NOT_PAID': return 'status-not-paid';
            default: return '';
        }
    };

    const formatStatusText = (text: any) => {
        if (typeof text === 'string') {
            return text
                .toLowerCase()
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return text; // Trả về giá trị gốc nếu không phải là chuỗi
    };
    
    const fullName = `${rowData.first_name || rowData.name} ${rowData.last_name || ''}`.trim(); // Tạo fullName

    const dayOfSlot = rowData.time_slot
        ? `${rowData.time_slot.day}/${rowData.time_slot.month}/${rowData.time_slot.year}`.trim()
        : 'N/A';

    return (
        <tr>
            {columns.map((column) => (
                <td key={column}
                    className={
                        column === 'appointment_status' || column === 'payment_status'
                            ? getStatusClass(rowData[column])
                            : ''
                    }
                >
                    {column === 'fullName' ? (
                        <div className="d-flex justify-content-center align-items-center ms-5" >
                            <img
                                src={rowData.avatar || defaultImage}
                                style={{ width: 35, height: 35, borderRadius: '50%', border: '1px solid #002d72' }}
                            />
                            <span className="flex-grow-1 text-center fw-bold" style={{ width: "50px" }}>{fullName}</span>
                        </div>
                    ) : column === 'dayOfSlot' ? (
                        <div>{dayOfSlot}</div> // Format datetime column
                    ) : column === 'datetime' ? (
                        <div>{rowData.created_date}</div> // Format datetime column
                    ) : (
                        // !rowData[column] ? '' : rowData[column]
                        rowData[column] ? formatStatusText(rowData[column]) : '' // Format status column
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
