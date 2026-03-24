// src/mockData.ts

interface ColumnData {
    id: number;
    name: string;
    status: string;
}

const mockData: ColumnData[] = [
    { id: 1, name: 'Veterinarian A', status: 'Done' },
    { id: 2, name: 'Veterinarian B', status: 'In process' },
    { id: 3, name: 'Veterinarian C', status: 'Done' },
    { id: 4, name: 'Veterinarian D', status: 'Pending' },
    { id: 5, name: 'Veterinarian E', status: 'Done' },
];

export default mockData;
