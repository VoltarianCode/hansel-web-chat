var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
	var message = sequelize.define('message', {
		text: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 4000]
			}
		},
		timestamp: {
			type: DataTypes.INTEGER,
			set: function(){
				this.setDataValue('timestamp', moment().valueOf());
			}

		}
	});
	return message;
};