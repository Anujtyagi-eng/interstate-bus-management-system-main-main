const db = require('../config/dbConfig');

const bookseat = async (busid,userid,seatnumber,paymentid) => {
    try {
        const insertBookingText = 'INSERT INTO bookings(busid,seatnumber,times,userid,paymentid) VALUES($1, $2, $3,$4,$5) RETURNING *';
        const insertBookingValues = [busid,seatnumber,new Date(),userid,paymentid];
        const response = await db.query(insertBookingText, insertBookingValues);
        return response.rows[0];

    } catch (error) {
        console.error('Error booking seat:', error);
        throw error;
    }
}

module.exports = {
    bookseat
};