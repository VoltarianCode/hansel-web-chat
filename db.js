var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		'dialect': 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + "/data/hansel-web-chat-db.sqlite"
	});
}

var db = {};

db.user = sequelize.import(__dirname + '/models/user.js');
db.group = sequelize.import(__dirname + '/models/group.js');
db.message = sequelize.import(__dirname + '/models/message.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.group.belongsToMany(db.user, { through: 'convos'});
db.user.belongsToMany(db.group, { through: 'convos'});

db.group.hasMany(db.message);
db.user.hasMany(db.message);

module.exports = db;