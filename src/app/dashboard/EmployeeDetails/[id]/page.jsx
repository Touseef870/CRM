'use client'

import { useParams } from "next/navigation";
import dayjs from 'dayjs';


const employeeDetails = [
    {
        id: 'USR-010',
        name: 'Alcides Antonio',
        avatar: '/assets/avatar-10.png',
        email: 'alcides.antonio@devias.io',
        phone: '908-691-3242',
        address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-009',
        name: 'Marcus Finn',
        avatar: '/assets/avatar-9.png',
        email: 'marcus.finn@devias.io',
        phone: '415-907-2647',
        address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-008',
        name: 'Jie Yan',
        avatar: '/assets/avatar-8.png',
        email: 'jie.yan.song@devias.io',
        phone: '770-635-2682',
        address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },
    {
        id: 'USR-007',
        name: 'Nasimiyu Danai',
        avatar: '/assets/avatar-7.png',
        email: 'nasimiyu.danai@devias.io',
        phone: '801-301-7894',
        address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
        createdAt: dayjs().subtract(2, 'hours').toDate(),
    },

]
export default function EmployeeDeatils() {

    const { id } = useParams()
    const employee = employeeDetails.find((employee) => employee.id == id)
    console.log(employee)

    return (
        <div>
        <h1>Employee Details</h1>
        <div>
            <h2>{employee.name}</h2>
            <p>Email: {employee.email}</p>
            <p>Phone: {employee.phone}</p>
            <p>Address: {employee.address.street}, {employee.address.city}, {employee.address.state}, {employee.address.country}</p>
            <img src={employee.avatar} alt={employee.name} />
        </div>
    </div>
    )
}
