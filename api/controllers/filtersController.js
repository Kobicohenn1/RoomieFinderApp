const axios = require('axios');
const User = require('../model/User');
const Filter = require('../model/Filter');

exports.uploadFiltersDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User Not Found' });
    }

    let filter;

    //Check if user already has a filter associated
    if (!user.filters) {
      //Create a new Filter and associate it to the user
      filter = new Filter({
        user: user._id,
        ...req.body,
      });
      await filter.save();

      // Save the filter reference in the user document
      user.filters = filter._id;
      await user.save();
      return res
        .status(200)
        .json({ msg: 'Upload Filters details successfully' });
    } else {
      //if user already have a filter
      filter = await Filter.findById(user.filters);
      if (!filter) {
        return res.status(404).json({ msg: 'Filter Not Found' });
      }

      //update the filter details
      Object.assign(filter, req.body);
      await filter.save();
      return res.status(200).json({ msg: 'Updated Filter Successfully' });
    }
  } catch (error) {
    console.error('Error uploading filters details:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getFilterData = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = await Filter.findById(id);

    if (!filter) {
      return res.status(404).json('Filter not found');
    }
    return res.json(filter);
  } catch (error) {
    console.error('Server Error', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
