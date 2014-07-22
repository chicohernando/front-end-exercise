var chicohernando = {
	dataTable: null,
	validTrainLines: ['El', 'Amtrak', 'Metra'],
	trains: [],
	Train: function (jsonTrain) {
		this.trainLine = jsonTrain.trainLine || '';
		this.routeName = jsonTrain.routeName || '';
		this.runNumber = jsonTrain.runNumber || '';
		this.operatorId = jsonTrain.operatorId || '';

		/**
		 * Returns a representation of the Train as a DOM TR
		 */
		this.getAsTableRow = function() {
			$row = jQuery('<tr>');
			$row.append(jQuery('<td>').append(this.trainLine));
			$row.append(jQuery('<td>').append(this.routeName));
			$row.append(jQuery('<td>').append(this.runNumber));
			$row.append(jQuery('<td>').append(this.operatorId));
			return $row;
		};

		/**
		 * Returns an array of the train data
		 */
		this.getAsDataTablesRow = function() {
			return [
				this.trainLine,
				this.routeName,
				this.runNumber,
				this.operatorId
			];
		};

		/**
		 * Returns an md5 hash of this object
		 */
		this.md5 = function() {
			return jQuery.md5(this.trainLine + this.routeName + this.runNumber + this.operatorId);
		}
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
			
			//add train to train array, this md5 key will prevent duplicate rows
			var trainObject = new _this.Train(train)
			_this.trains[trainObject.md5()] = trainObject;
		});

		//call function to populate the table
		_this.populateTrainTable();
	},

	/**
	 * Adds all of the data from the trains array to the table on the page
	 */
	populateTrainTable: function() {
		//loop through each train that we have and add it to the end of the table
		for (var index in this.trains) {
			this.dataTable.row.add(this.trains[index].getAsDataTablesRow()).draw();
		}
	}
};

jQuery(document).ready(function() {
	chicohernando.dataTable = jQuery('#results').DataTable({
		"lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]]
	});

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
});