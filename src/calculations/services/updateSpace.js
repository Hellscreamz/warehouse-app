const SpaceModel = require('../models/spaceWarehouses');

exports.callUpdateSpaceService = async (app) => {
  app.get('/update-space', async (req, res) => {
    try {
      await SpaceModel.update();
      res.status(200).send('Space data updated');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating space data');
    }
  });
};
