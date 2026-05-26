const MoveRequest = require('./MoveRequest');
const Vehicle = require('./Vehicle');
const MoveRecord = require('./MoveRecord');
const Rating = require('./Rating');

MoveRequest.hasMany(MoveRecord, { foreignKey: 'requestId', as: 'records' });
MoveRecord.belongsTo(MoveRequest, { foreignKey: 'requestId', as: 'request' });

Vehicle.hasMany(MoveRecord, { foreignKey: 'vehicleId', as: 'records' });
MoveRecord.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

MoveRecord.hasOne(Rating, { foreignKey: 'recordId', as: 'rating' });
Rating.belongsTo(MoveRecord, { foreignKey: 'recordId', as: 'record' });

MoveRequest.hasMany(Rating, { foreignKey: 'requestId', as: 'ratings' });
Rating.belongsTo(MoveRequest, { foreignKey: 'requestId', as: 'request' });

module.exports = {
  MoveRequest,
  Vehicle,
  MoveRecord,
  Rating
};
