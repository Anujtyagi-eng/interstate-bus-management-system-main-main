const router = require('express').Router();
const db = require('../config/dbConfig');
const authMiddleware = require('../middlewares/authMiddleware');
const { addBus } = require('../models/busModel');
require('dotenv').config();
const moment = require('moment');


// add bus
router.post('/add-bus',authMiddleware, async (req, res) => {
    const { busnumber, busid, capacity, origin, destination, dates, departuretime, arrivaltime, amount } = req.body;

    try {
        const checkBusExistsQuery = 'SELECT * FROM buses WHERE busid = $1';
        const busExists = await db.query(checkBusExistsQuery, [busid]);
        if (busExists.rows.length > 0) {
            return res.send({
                message: 'Bus already exists',
                success: false,
                data: null,
            });
        }
        // No bus exists, proceed with creating a new bus
        const newBus = await addBus(busnumber, busid, capacity, origin, destination, dates, departuretime, arrivaltime, amount);

        res.send({
            message: 'Bus added successfully',
            success: true,
            data: newBus,
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});


// get all buses and then filter
router.post('/get-all-buses', authMiddleware, async (req, res) => {
    try {
        // Fetch all buses from the database
        const allBusesQuery = 'SELECT * FROM buses';
        const allBuses = await db.query(allBusesQuery);

        // Apply filters if provided
        if (req.body) {
            const { origin, destination, dates } = req.body;
            let filteredBuses = allBuses.rows;
            
            // Filter by origin
            if (origin) {
                filteredBuses = filteredBuses.filter(bus => bus.origin.toLowerCase() === origin);
            }

            // Filter by destination
            if (destination) {
                filteredBuses = filteredBuses.filter(bus => bus.destination.toLowerCase() === destination);
            }

            // Filter by date
            if (dates) {
                const formattedDate = moment(dates).format('YYYY-MM-DD'); 
                filteredBuses = filteredBuses.filter(bus => moment(bus.dates).format('YYYY-MM-DD') === formattedDate);
            }

            res.send({
                message: 'Filtered buses fetched successfully',
                success: true,
                data: filteredBuses,
            });
        } else {
            // If no filters provided, return all buses
            res.send({
                message: 'All buses fetched successfully',
                success: true,
                data: allBuses.rows,
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


// update bus
router.post('/update-bus',authMiddleware, async (req, res) => {
    try{
        const checkBusExistsQuery = 'SELECT * FROM buses WHERE busid = $1';
        console.log(req.body);
        const { busnumber, busid, capacity, origin, destination, dates, departuretime, arrivaltime, amount,status } = req.body;
        const updateBusQuery = 'UPDATE buses SET busnumber = $1, capacity = $2, origin = $3, destination = $4, dates = $5, departuretime = $6, arrivaltime = $7, amount = $8,status=$9 WHERE busid = $10';
        const updatedBus = await db.query(updateBusQuery, [busnumber, capacity, origin, destination, dates, departuretime, arrivaltime, amount, status,busid]);
        res.send({
            message: 'Bus updated successfully',
            success: true,
            data: updatedBus.rows,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// delete bus
// router.post('/delete-bus',authMiddleware, async (req, res) => {
//     try {
//         const { busid } = req.body;
//         // console.log(req.body);
//         const deleteBusQuery = 'DELETE FROM buses WHERE busid = $1';
//         const deletedBus = await db.query(deleteBusQuery, [busid]);
//         res.send({
//             message: 'Bus deleted successfully',
//             success: true,
//             data: deletedBus.rows,
//         });
//     } catch (error) {
//         res.status(500).send({
//             message: error.message,
//             success: false,
//             data: null,
//         });
//     }
// });

//get bus by id
router.post('/get-bus-by-id',authMiddleware, async (req, res) => {
    try {
        const { busid } = req.body;
        // console.log(req.body);
        const getBusByIdQuery = 'SELECT * FROM buses WHERE busid = $1';
        const bus = await db.query(getBusByIdQuery, [busid]);
        res.send({
            message: 'Bus fetched successfully',
            success: true,
            data: bus.rows,
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
