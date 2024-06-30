
const db = require('../config/dbConfig');


const addBus = async (busnumber,busid,capacity,origin,destination,dates,departuretime,arrivaltime,amount) => {
    try {
        const insertBusText = 'INSERT INTO buses(busnumber,busid,capacity,origin,destination,dates,departuretime,arrivaltime,amount) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        const insertBusValues = [busnumber,busid,capacity,origin,destination,dates,departuretime,arrivaltime,amount];
        const response = await db.query(insertBusText, insertBusValues);
        return response.rows[0];
    } catch (error) {
        console.error('Error adding new bus:', error);
        throw error;
    }
}
module.exports ={
    addBus
}


