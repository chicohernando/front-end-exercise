var chicohernando = {
	validTrainLines: ['El', 'Amtrak', 'Metra'],
	trains: [],
	Train: function (jsonTrain) {
		this.trainLine = jsonTrain.trainLine || '';
		this.routeName = jsonTrain.routeName || '';
		this.runNumber = jsonTrain.runNumber || '';
		this.operatorId = jsonTrain.operatorId || '';
	},
	handleIncomingTrainData: function(trains) {
		var _this = this; // keep a reference to the original this
		jQuery.each(trains, function(index, train) {
			//trim each string we care about
			train.trainLine = jQuery.trim(train.trainLine);
			train.routeName = jQuery.trim(train.routeName);
			train.runNumber = jQuery.trim(train.runNumber);
			train.operatorId = jQuery.trim(train.operatorId);

			//check for proper train line
			if (jQuery.inArray(train.trainLine, _this.validTrainLines) == -1) {
				return;
			}

			//fill in missing data with "unknown"
			if (!train.routeName) {
				train.routeName = 'unknown';
			}

			if (!train.runNumber) {
				train.runNumber = 'unknown';
			}

			if (!train.operatorId) {
				train.operatorId = 'unknown';
			}
			
			//add train to train array
			_this.trains.push(new _this.Train(train));
		});

		//call function to populate the table
		_this.populateTrainTable();
	},
	populateTrainTable: function() {
		console.log('TODO: populateTrainTable');
	}
};

jQuery.ajax({
	url: '/js/trains.json',
	dataType: 'json',
	success: function(response) {
		chicohernando.handleIncomingTrainData(response.data);
	},
	error: function() {
		alert("There was an error loading the data.  Please try again later.");
	}
});