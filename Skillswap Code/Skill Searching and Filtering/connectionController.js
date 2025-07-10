//controllers/connectionController.js

const { User, Connection} = require('../models/DBModels');

// send connection request
const sendConnection = async (req,res) => {
    const senderID = req.user._id;
    const recipientID = req.params.recipientID;

    if (senderID.toString() === recipientID){
        return res.status(400).json({message:"Cannot connect to yourself"});
    } 
    
    const sender = await User.findById(senderID); // update the latest user
    
    const recipient = await User.findById(recipientID); 
    if (!recipient) return res.status(404).json({message:"user not found"});
 
    
    // check if the connection already exist
    const existedConenction = await Connection.findOne({
        $or: [
            { sender: senderID, recipient: recipientID },
            { sender: recipientID, recipient: senderID }
        ]
    });
    if (existedConenction) return res.status(400).json({message: "Connection is  pending"})
    
    // create new connection request
    const connection = new Connection({
        sender: senderID,
        recipient: recipientID,
        status: 'pending'
    });
    await connection.save();

    // Add to both users' connections array
    sender.connections.push(connection._id);
    recipient.connections.push(connection._id);
    await sender.save();
    await recipient.save();

    res.json({ message: "Connection request sent" });
    
}

// accept connection request
const acceptRequest = async (req, res) =>{
    const userID = req.user._id;
    const connectionID = req.params.connectionID;
    const connection = await Connection.findById(connectionID);
    if (!connection) return res.status(404).json({ message: "Connection not found" });

    // protect other viewing request:
    if (!connection.recipient.equals(userID)) {
        return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    connection.status = 'accepted';
    await connection.save();
    res.json({ message: "Connection request accepted" });

}

// decline connection request
const declineRequest = async (req, res) =>{
    const userID = req.user._id;
    const connectionID = req.params.connectionID;
    const connection = await Connection.findById(connectionID);
    if (!connection) return res.status(404).json({ message: "Connection not found" });

    // protect other viewing request:
    if (!connection.recipient.equals(userID)) {
        return res.status(403).json({ message: "Not authorized to decline this request" });
    }

    connection.status = 'declined';
    await connection.save();
    res.json({ message: "Connection request declined" });
}

//list all incomming request
const listRequest = async (req, res) =>{
    const userID = req.user._id;
    try{
        const listRequests = await Connection.find({recipient: userID, status:'pending'}).populate('sender').lean();
        res.json({
            listRequests
        })
    }catch(error){
        return res.status(404).json({message:'Request not found'})
    }   
}

// list all current user connection
const  listConnections = async (req, res) =>{
    const userID = req.user._id;
    const connections = await Connection.find(
        {
            $and:[
                { status: 'accepted' },
                { $or: [{ sender: userID }, { recipient: userID }] }
            ]
        }).populate('sender recipient').lean();
    // console.log(connections)
    res.json({
        connections
    })
}
module.exports ={
    sendConnection,
    acceptRequest,
    declineRequest,
    listConnections,
    listRequest
}