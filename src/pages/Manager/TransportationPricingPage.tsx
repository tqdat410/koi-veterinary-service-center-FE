import React, { useEffect, useState } from 'react';
import { fetchTransportationPrices, updateTransportationPrice } from '../../api/transportApi';
import PricingManagementTable from '../../components/Pricing/PricingManagementTable';
import Sidebar from "../../components/layout/Sidebar";
import Pagination from '@mui/material/Pagination';

const TransportationPricingPage: React.FC = () => {
    const [locations, setLocations] = useState<any[]>([]);
    const [updatedPrices, setUpdatedPrices] = useState<{ [key: string]: number }>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(8); // Set the number of items per page


    useEffect(() => {
        const fetchData = async () => {
            try {
                const districtData = await fetchTransportationPrices();
                console.log('Fetched services:', districtData);
                setLocations(districtData);

            } catch (error) {
                alert('Failed to fetch services. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const handlePriceChange = (locationId: number, price: number) => {
        if (price < 0) {
            alert('Price cannot be negative.');
            return;
        }
        setUpdatedPrices((prev) => ({ ...prev, [locationId]: price }));
    };

    const handleSubmit = async (movingSurchargeId: number) => {
        if (!movingSurchargeId) {
            alert('Service ID is missing.');
            return;
        }
        const districtToUpdate = locations.find((location) => location.moving_surcharge_id === movingSurchargeId);
        if (updatedPrices[movingSurchargeId] === undefined) {
            alert('Please enter a new price.');
            return;
        }

        const updatedSurcharges = {
            moving_surcharge_id: movingSurchargeId,
            district: districtToUpdate.district,

            price: updatedPrices[movingSurchargeId],
        };

        try {
            await updateTransportationPrice(movingSurchargeId, updatedSurcharges);
            alert('Price updated successfully!');

            setLocations((prevLocations) =>
                prevLocations.map((location) =>
                    location.moving_surcharge_id === movingSurchargeId
                        ? { ...location, price: updatedPrices[movingSurchargeId] }
                        : location
                )
            );
        } catch (error) {
            console.error('Error updating price:', error);
            alert('Failed to update price. Please try again later.');
        }
    };

    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    };

    // Calculate total pages
    const indexOfLastAddress = currentPage * itemsPerPage;
    const indexOfFirstAddress = indexOfLastAddress - itemsPerPage;
    const currentLocations = locations.slice(indexOfFirstAddress, indexOfLastAddress)

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <div className="d-flex flex-grow-1" style={{ marginLeft: '272px' }}>
            <Sidebar />
            <div className="container" style={{ marginTop: "6rem" }}>
                <div className="card" style={{ width: '100%' }}>
                    <div className="card-header">
                        <h5 className="text-start" style={{
                            fontWeight: "bold",
                            color: "#02033B",
                            fontSize: "2.6rem",
                            padding: "1.2rem"
                        }}>Transportation Pricing Management</h5>
                    </div>
                    <div className="card-body">
                        <PricingManagementTable
                            data={currentLocations.map((location) => ({
                                id: location.moving_surcharge_id,
                                name: location.district,
                                price: location.price,
                            }))}
                            onPriceChange={handlePriceChange}
                            onSubmit={handleSubmit}
                            columns={['Location', 'Current Price', 'New Price', '']}
                            formatPrice={formatPrice}
                        />
                        <Pagination
                            count={Math.ceil(locations.length / itemsPerPage)} // Total pages
                            shape="rounded"
                            page={currentPage} // Current page
                            onChange={handlePageChange} // Page change handler
                            style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }} // Center the pagination
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportationPricingPage;
