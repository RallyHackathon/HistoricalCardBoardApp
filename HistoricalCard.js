Ext.define('Rally.ui.cardboard.HistoricalCard', {
    extend: 'Rally.ui.cardboard.ArtifactCard',
    componentCls: 'historical-card',
	alias: 'widget.historicalcard',
	
	inheritableStatics: {

		/**
		 * @returns {String[]} List of field names needed to render, used in addition to Rally.ui.cardboard.Card.getDisplayedContentFields to create Rally.ui.cardboard.Card.getRequiredFetchFields
		 * @protected
		 */
		getAdditionalFetchFields: function() {
			return [];
		},

		/**
		 * @returns {String[]} List of field names to be displayed in the card content
		 * @protected
		 */
		getDisplayedContentFields: function() {
			return ['Name'];
		}

	},
	
	getOwnerDataFromRecord: function(record){
		var ownerData = {};
		var contextPath = Rally.environment.getServer().getContextUrl();
		if (record.get('Owner')) {
			ownerData.profileImageSrc = contextPath + '/profile/viewThumbnailImage.sp?tSize=20&uid=' + record.get('Owner');
			
			//TODO get owner name somehow (maybe async?)
			//ownerData.ownerName = record.get('Owner')._refObjectName;
		} else {
			//ownerData.ownerName = 'No Owner';
			ownerData.profileImageSrc = contextPath + '/images/rally/components/profile-mark-18.png';
		}

		return ownerData;
	},
	
	buildHeader: function(){
		var renderData = this.getOwnerDataFromRecord(this.getRecord());
		Ext.applyIf(renderData, this.getRecord().data);

		return Ext.widget('container', {
			itemId: 'cardHeader',
			cls: 'cardHeader',
			renderTpl: Ext.create('Ext.XTemplate',
				'<div class="leftCardHeader">',
				'    <a href="{[Rally.util.Navigation.createRallyDetailUrl(values)]}" target="_top">{FormattedID}</a>',
				'</div>',
				'<img class="cardOwner" src="{profileImageSrc}">'
				//,
				//'<div class="cardOwnerName">{ownerName}</div>'
			),
			renderData: renderData
		});

	}
	
});