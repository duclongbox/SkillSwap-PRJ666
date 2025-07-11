const {Skill, User} = require('../models/DBModels');

const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find().populate('owner_id', 'name email');
        res.json(skills);
    } catch(error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({message: 'Error fetching skills'});
    }
}

module.exports = {getAllSkills};