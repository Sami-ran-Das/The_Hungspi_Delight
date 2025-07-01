import ErrorHandler from "../middlewares/error.js";
import Reservation from "../models/reservation.js";

const send_reservation = async (req, res, next) => {
  try {
    console.log("Received request body:", req.body); // Debug log
    
    const { firstName, lastName, email, date, time, phone } = req.body;

    // Check if any field is missing
    if (!firstName || !lastName || !email || !date || !time || !phone) {
      console.log("Missing fields:", { firstName, lastName, email, date, time, phone });
      return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
    }

    // Validate phone number format (remove any non-digits)
    const cleanPhone = phone.toString().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return next(new ErrorHandler("Phone number must be exactly 10 digits!", 400));
    }

    // Create reservation object
    const reservationData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      date,
      time,
      phone: cleanPhone
    };

    console.log("Creating reservation with data:", reservationData);

    // Create a new reservation
    const reservation = await Reservation.create(reservationData);

    console.log("Reservation created successfully:", reservation);

    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
      data: reservation
    });

  } catch (error) {
    console.error("Error in send_reservation:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      console.log("Validation errors:", validationErrors);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(new ErrorHandler(`${field} already exists`, 400));
    }

    // Handle other errors
    return next(new ErrorHandler(error.message || "Failed to create reservation", 500));
  }
};

export default send_reservation;