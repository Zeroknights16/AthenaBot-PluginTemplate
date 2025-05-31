const modelBuilder = require('../../../../main/core/database/modelBuilder.js');

module.exports = class testModel extends modelBuilder {
	constructor() {
        // Import this model using "this.heart.core.database.getModel('<modelName>').getModel()".
        //
        // "test" being the model name in this case.
		super('test', {
			version: Number,
			guildId: String,
			id: String,
		});
	}
};