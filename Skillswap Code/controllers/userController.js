const {User} = require('../models/DBModels');

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    }catch(error){
        res.status(500).json({message: 'Error fetching user'});
    }
}
const getCurrentUserFunction = (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            email: req.user.email
        }
    });
};

module.exports = { getUserById , getCurrentUserFunction};