import { Request, Response } from "express";
import axios from "axios";
import { db } from "../config/firebase"; // Adjust the import path as necessary
import { doc, updateDoc } from "firebase/firestore";
import dotenv from "dotenv";
import { getUserById } from "../models/userModel";

dotenv.config();

// Function to initiate payment
export const initiatePayment = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body; // Extract amount from request body

  // Validate input
  if (!userId || !amount) {
    return res.status(400).json({ error: "User ID and amount are required." });
  }

  // Fetch user details
  const user = await getUserById(userId);
  console.log("user:", user);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  // Create a payment request to Flutterwave
  const paymentData = {
    tx_ref: `txn_${Date.now()}`, // Unique transaction reference
    amount: amount, // Amount to charge
    currency: "NGN", // Currency
    payment_type: "card", // Payment type
    email: user.email, // User email
    redirect_url: "https://yourwebsite.com/callback", // Redirect URL after payment
  };

  try {
    const response: any = await axios.post(
      "https://api.flutterwave.com/v3/charges?type=redirect",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, // Use your secret key
          "Content-Type": "application/json",
        },
      }
    );

    const { link } = response.data.data; // Get the payment link from the response
    res.status(200).json({ link }); // Return the payment link to the client
  } catch (error: any) {
    console.error(
      "Error initiating payment:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to initiate payment. Please try again later.",
      details: error.response?.data || error.message,
    });
  }
};

// Function to handle payment callback
export const paymentCallback = async (req: Request, res: Response) => {
  const { status, tx_ref } = req.body; // Extract status and transaction reference from the callback

  if (status === "successful") {
    // Update the registration fee status in Firestore
    try {
      const userRef = doc(db, "users", tx_ref); // Assuming tx_ref is the userId
      await updateDoc(userRef, { registrationFeeStatus: "paid" });
      res
        .status(200)
        .json({ message: "Registration fee status updated to paid." });
    } catch (error) {
      console.error("Error updating registration fee status:", error);
      res
        .status(500)
        .json({ error: "Failed to update registration fee status." });
    }
  } else {
    res.status(400).json({ message: "Payment was not successful." });
  }
};

// export const PayForBusinessRegistrationWithFlutterwave = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { userID, businessID } = req.params;

//       const user = await UserModels.findById(userID);
//       if (!user) {
//         return next(
//           new MainAppError({
//             message: "User not found",
//             httpcode: HTTPCODES.UNAUTHORIZED,
//           })
//         );
//       }

//       const getBusiness = await BusinessRegistrationModels.findById(businessID);

//       const amount: number = 25000;

//       const GenerateTransactionReference = uuid();

//       // Processing the payment with Flutterwave:

//       const response = await fetch("https://api.flutterwave.com/v3/payments", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${EnvironmentVariables.SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           tx_ref: GenerateTransactionReference,
//           amount: `${amount}`,
//           currency: "NGN",
//           redirect_url: "https://firstcapital.vercel.app/",
//           meta: {
//             consumer_id: user?._id,
//           },
//           customer: {
//             email: user?.email,
//             phonenumber: user?.phoneNumber,
//             name: user?.name,
//           },
//           customizations: {
//             title: "First Capital",
//             logo: "https://firstcapital.vercel.app/assets/logo1-b9ccfcb5.png",
//           },
//         }),
//       });

//       if (response.ok) {
//         const responseBody = await response.json();

//         // Check if payment was successful
//         if (responseBody.status === "success") {
//           // Update the business registration status
//           const UpdateBizStatus =
//             await BusinessRegistrationModels.findByIdAndUpdate(
//               getBusiness?._id,
//               {
//                 status: "Paid",
//               },
//               { new: true }
//             );

//           const BusinessTransactions = await TransactionModels.create({
//             message: `Dear ${user?.name}, you have paid for ${getBusiness?.ProposedBusinessName1} business registration`,
//             amount: amount,
//             TransactionReference: GenerateTransactionReference,
//             TransactionType: "Debit",
//             TransactionStatus: "Business Registration",
//           });

//           user?.transactions.push(
//             new mongoose.Types.ObjectId(BusinessTransactions._id)
//           );

//           user?.save();

//           return res.status(HTTPCODES.CREATED).json({
//             message: "Payment for business registration successful",
//             datafromPayment: responseBody,
//             BusinessRegistrationAmount: amount,
//             BusinessRegistrationStatus: UpdateBizStatus?.status,
//           });
//         } else {
//           console.log("Payment was not successful:", responseBody);
//           return res.status(HTTPCODES.BAD_REQUEST).json({
//             message: "Payment failed. Business registration not updated.",
//             datafromPayment: responseBody,
//           });
//         }
//       } else {
//         console.log(
//           `Request was not successful. Status code: ${response.status}`
//         );
//         return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
//           message: "Payment request was not successful.",
//         });
//       }
//     } catch (error: any) {
//       if (error.name === "CastError") {
//         return res.status(HTTPCODES.NOT_FOUND).json({
//           message: "User not found. Sign up",
//         });
//       }
//       return res.status(HTTPCODES.INTERNAL_SERVER_ERROR).json({
//         message: "An Error Occurred In Business registration Payment",
//         error: error?.message,
//       });
//     }
//   }
// );
