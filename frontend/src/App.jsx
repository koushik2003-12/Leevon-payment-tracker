import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);


    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const [payment, setPayment] = useState({
        date: "",
        time: "",
        reason: "",
        gstAvailable: false,
        paidBy: "parthu",
        transactionId: ""
    });
    const [payments, setPayments] = useState([]);

    const [editingPaymentId, setEditingPaymentId] = useState(null);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [confirmName, setConfirmName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    const fetchPayments = async () => {
        try {
            const response = await fetch(
                "https://leevon-payment-tracker-api.vercel.app/api/payments"
            );

            const data = await response.json();

            if (response.ok) {
                setPayments(data);
            }
            else {
                console.error("Failed to fetch payments:", data.message);
            }

        }
        catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `https://leevon-payment-tracker-api.vercel.app/api/payments/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

                if (response.ok) {
                    setPayments((prevPayments) =>
                        prevPayments.filter((payment) => payment._id !== id)
                    );
                }
                else {
                    console.error("Delete failed:", data.message);
                }

        }
        catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleEdit = (item) => {
        setEditingPaymentId(item._id);

        setPayment({
            date: item.date,
            time: item.time,
            reason: item.reason,
            gstAvailable: item.gstAvailable,
            paidBy: item.paidBy,
            transactionId: item.transactionId
        });

        setShowPaymentForm(true);
    };

    useEffect(() => {
        if (loggedIn) {
            fetchPayments();
        }
    }, [loggedIn]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            const response = await fetch("https://leevon-payment-tracker-api.vercel.app/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful!");
                setLoggedIn(true);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };
    const handlePaymentChange = (e) => {
        const { name, value, type, checked } = e.target;

        setPayment({
            ...payment,
            [name]: type === "checkbox" ? checked : value
        });
    };

    if (loggedIn) {
    return (
        <div>
            <h1>LEEVON DELIVERY</h1>
            <h2>Payment Tracker</h2>

            <p>Welcome, {username}!</p>

            <button className="add-payment-btn"
                onClick={() => setShowPaymentForm(true)}
            > Add transaction + </button>
            
            {payments.length > 0 && (
                <div className="payments-container">

                    <h2>Transactions</h2>

                    <table className="payments-table">

                        <thead>
                            <tr>
                                <th>S.no</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Reason</th>
                                <th>GST</th>
                                <th>Paid By</th>
                                <th>Transaction ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.date}</td>
                                    <td>{item.time}</td>
                                    <td>{item.reason}</td>
                                    <td>{item.gstAvailable ? "Yes" : "No"}</td>
                                    <td>{item.paidBy}</td>
                                    <td>{item.transactionId}</td>
                                    <td>
                                        <button className="edit-btn"
                                            onClick={() => handleEdit(item)}
                                        > 
                                            Edit 
                                        </button>
                                        <button className="delete-btn" 
                                            onClick={() => {
                                                const confirmed = window.confirm("Sure you wanna Delete ?");
                                                if(confirmed){
                                                    handleDelete(item._id);
                                                }
                                            }}
                                        > 
                                            Delete 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}

            {showPaymentForm && (
                <div className="payment-form-overlay">

                    <div className="payment-form">

                        <h2>Add Payment</h2>

                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={payment.date}
                            onChange = {handlePaymentChange}
                        />

                        <label>Time</label>
                        <input
                            type="time"
                            name="time"
                            value={payment.time}
                            onChange={handlePaymentChange}
                        />

                        <label>Reason</label>
                        <input
                            type="text"
                            name="reason"
                            placeholder="Enter reason"
                            value={payment.reason}
                            onChange={handlePaymentChange}
                        />

                        <label className="gst-checkbox">
                            <input
                                type="checkbox"
                                name="gstAvailable"
                                checked={payment.gstAvailable}
                                onChange={handlePaymentChange}
                            />
                            GST Available
                        </label>

                        <label>Who Done Payment</label>

                        <select>
                            name="paidBy"
                            value={payment.paidBy}
                            onChange={handlePaymentChange}
                        
                            <option value="parthu">Parthu</option>
                            <option value="sai">Sai</option>
                            <option value="Vineeth">Vineeth</option>
                        </select>

                        <label>Transaction ID</label>

                        <input
                            type="text"
                            name="transactionId"
                            placeholder="Enter transaction ID"
                            value={payment.transactionId}
                            onChange={handlePaymentChange}
                        />

                        <div className="payment-form-buttons">

                            <button
                                type="button"
                                onClick={() => {setShowConfirmation(false); setShowPaymentForm(false); setEditingPaymentId(null);}}
                            >
                                Cancel
                            </button>

                            <button type="button"
                            onClick={() => {

                                if(
                                    !payment.date ||
                                    !payment.time ||
                                    !payment.reason ||
                                    !payment.transactionId
                                ){
                                    alert("Please fill in all details")
                                    return;
                                }

                                setConfirmName("");
                                setConfirmPassword("");
                                setConfirmMessage("");
                                setShowPaymentForm(false);
                                setShowConfirmation(true);
                            }}
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>
            )}
            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-form">
                        <h2>Confirm Payment</h2>
                        <p>
                            Enter your name and password to confirm this payment.
                        </p>
                        
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                        />

                       <label>Password</label>

                       <input
                            type="password"
                            placeholder="Enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {confirmMessage && (
                            <p className="confirmation-message">
                                {confirmMessage}
                            </p>
                        )}

                        <div className="payment-form-buttons">

                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    setConfirmMessage("");

                                    try {
                                        // Step 1: Verify username and password
                                        const verifyResponse = await fetch(
                                            "https://leevon-payment-tracker-api.vercel.app/api/verify",
                                            {
                                               method: "POST",
                                               headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    username: confirmName,
                                                    password: confirmPassword
                                                })
                                            }
                                        );

                                        const verifyData = await verifyResponse.json();

                                        // Stop if credentials are wrong
                                        if (!verifyResponse.ok) {
                                            setConfirmMessage(verifyData.message);
                                            return;
                                        }

                                        let paymentResponse;

                                        if (editingPaymentId) {
                                            paymentResponse = await fetch(
                                                `https://leevon-payment-tracker-api.vercel.app/api/payments/${editingPaymentId}`,
                                                {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify(payment)
                                                }
                                            );
                                        }
                                        else {
                                            paymentResponse = await fetch(
                                                "https://leevon-payment-tracker-api.vercel.app/api/payments/add",
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify(payment)
                                                }
                                            );
                                        }

                                        const paymentData = await paymentResponse.json();

                                        // Stop if payment could not be saved
                                        if (!paymentResponse.ok) {
                                            setConfirmMessage(paymentData.message);
                                            return;
                                        }

                                        // Step 3: Success
                                        setConfirmMessage(
                                            editingPaymentId
                                            ? "Payment Updated successfully!"
                                            : "Payment saved successfully!");

                                        await fetchPayments();

                                        setEditingPaymentId(null);

                                        setShowConfirmation(false);
                                        setShowPaymentForm(false);

                                    }
                                    catch (error) {
                                        console.error("Payment error:", error);
                                        setConfirmMessage("Unable to connect to server");
                                    }
                                }}
                            >
                                Confirm
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
}

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>LEEVON DELIVERY</h1>
                <h2>Login to continue</h2>

                <form onSubmit={handleLogin}>
                    <label>Username</label>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Login
                    </button>
                </form>

                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;