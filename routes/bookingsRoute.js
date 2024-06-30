const router = require('express').Router();
const db = require('../config/dbConfig');
const authMiddleware = require('../middlewares/authMiddleware');
const { bookseat } = require('../models/bookingsModel');
require('dotenv').config();
const stripe = require('stripe')(process.env.stripe_key);
const { v4: uuidv4 } = require('uuid');

// book seat
router.post('/book-seat', authMiddleware, async (req, res) => {
    const { busid, userId, seatnumber, paymentid } = req.body;
    console.log(req.body);
    try {
        const newSeats = [];
        for (const seat of seatnumber) {
            const seatNumberInt = parseInt(seat);
            const newSeat = await bookseat(busid, userId, seatNumberInt, paymentid);
            newSeats.push(newSeat);
        }
        res.send({
            message: 'Seats booked successfully',
            success: true,
            data: newSeats,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get booked seat by busid
router.post('/get-booked-seat', authMiddleware, async (req, res) => {
    const { busid } = req.body;
    const busidInt = parseInt(busid);
    console.log(busid);
    try {
        const bookedSeats = await db.query('SELECT seatnumber FROM bookings WHERE busid = $1', [busidInt]);
        res.send({
            message: 'Booked seats fetched successfully',
            success: true,
            data: bookedSeats.rows,
        });
        console.log(bookedSeats.rows);
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// make payment
router.post('/make-payment', authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const { token, amount } = req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4(),
        });
        if (payment) {
            res.status(200).send({
                message: 'Payment successful',
                success: true,
                data: { paymentid: payment.id },
            });
        }
        else {
            res.send({
                message: 'Payment failed',
                success: false,
                data: null,
            });
        }
    } catch (error) {

        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get bookings by user id
router.post('/get-bookings-by-user-id', authMiddleware, async (req, res) => {
    const { userId } = req.body;
    const userIdInt = parseInt(userId);
    try {
        // take all bookings of the user and details of the bus from buses table in which user has booked a seat
        const bookings = await db.query('SELECT b.busid,b.busnumber, b.origin, b.destination, b.dates,b.arrivaltime,b.departuretime, b.amount, bk.seatnumber FROM buses b INNER JOIN bookings bk ON b.busid = bk.busid WHERE bk.userid = $1', [userIdInt]);
        res.status(200).send({
            message: 'Bookings fetched successfully',
            success: true,
            data: bookings.rows,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get total revenue
router.post('/get-total-revenue', authMiddleware, async (req, res) => {
    try {
        const totalRevenue = await db.query(`
            SELECT 
                SUM(total_revenue) AS total_sum
            FROM (
                SELECT 
                    b.busid,
                    COUNT(*) * b.amount AS total_revenue
                FROM 
                    buses AS b
                JOIN 
                    bookings AS bk ON b.busid = bk.busid
                GROUP BY 
                    b.busid, b.amount
            ) AS revenue_per_bus;
        `);
        res.status(200).send({
            message: 'Total revenue fetched successfully',
            success: true,
            data: totalRevenue.rows[0].total_sum,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get total bookings
router.post('/get-total-bookings', authMiddleware, async (req, res) => {
    try {
        const totalBookings = await db.query('SELECT COUNT(*) FROM bookings');
        res.status(200).send({
            message: 'Total bookings fetched successfully',
            success: true,
            data: totalBookings.rows[0].count,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get revenue  for 12 months
router.post('/get-revenue-for-12-months', authMiddleware, async (req, res) => {
    try {
        const revenueFor12Months = await db.query(`

        WITH months AS (
            SELECT generate_series(date_trunc('month', CURRENT_DATE) - INTERVAL '11 months', date_trunc('month', CURRENT_DATE), '1 month') AS month
        )
        SELECT
            TO_CHAR(month, 'Month') AS month_name,
            COALESCE(SUM(b.amount), 0) AS total_revenue
        FROM
            months
        LEFT JOIN
            bookings AS bk ON TO_CHAR(date_trunc('month', bk.times), 'Month') = TO_CHAR(month, 'Month')
        LEFT JOIN
            buses AS b ON bk.busid = b.busid
        GROUP BY
            month
        ORDER BY
            month DESC;
    
        `);
        // console.log(revenueFor12Months.rows)
        res.status(200).send({
            message: 'Revenue for 12 months fetched successfully',
            success: true,
            data: revenueFor12Months.rows,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});






module.exports = router;
