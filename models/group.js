module.exports = function(sequelize, DataTypes) {
	var group = sequelize.define('group', {
		groupName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [3, 15]
			}
		}
	});
	return group;
};