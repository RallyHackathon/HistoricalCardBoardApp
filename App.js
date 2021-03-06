Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items:[
    	{
    		xtype: 'component',
    		itemId: 'titleDate',
    		html: '<h1>Current Date: '+ Rally.util.DateTime.format(new Date(), "m/d/Y T(P)") +'</h1>',
    		style: 'text-align:center; font-size: 24px; margin: 10px 10px; color:#333333'
    	},
        {
            xtype: 'container',
            layout: 'auto',
            style: 'text-align:center',
            border: false,
            height: 60,
			style: 'margin-left: 80px',
            defaults: {
				style: 'float:left; margin: 5px 5px'
			},
            defaultType: 'rallydatefield',
            items: [
                {
                    itemId: 'startDateField',
                    width: 100,
                    value: Rally.util.DateTime.add(new Date(), "day", -10)
                },
                {
                	xtype: 'container',
                	itemId: 'sliderHolder',
					layout: 'fit',
					width: 500
    			},
    			{
                    itemId: 'endDateField',
                    width: 100,
                    value: new Date()
                },
                {
                	xtype: 'rallybutton',
                	itemId: 'playButton',
                	text: 'Play'
                }
            ]
        },
        {
			xtype: 'container',
			itemId: 'cardboardHolder'
		}
    ],
    
    launch: function() {
    
    	var startDate = this.getStartDate();
    	var endDate = this.down('#endDateField').getValue();
    	this.currentDate = endDate;
    	
    	var startDateField = this.down('#startDateField');
		startDateField.on('blur', this.onStartDateChange, this);
		startDateField.on('select', this.onStartDateChange, this);
		
		var endDateField = this.down('#endDateField');
		endDateField.on('blur', this.onEndDateChange, this);
		endDateField.on('select', this.onEndDateChange, this);
		
		this.down('#playButton').on('click', this.playClicked, this);
    
    	this.noDays = Rally.util.DateTime.getDifference(endDate, startDate, 'day');
    	var app = this;
    
    	this.down('#sliderHolder').add({
			xtype: 'slider',
			itemId: 'dateSlider',
			hideLabel: true,
			width: 700,
			increment: 1,
			minValue: 0,
			maxValue: this.noDays,
			value: this.noDays,
			tipText: function(thumb){
				var tickerDate = Rally.util.DateTime.add(app.getStartDate(), "day", thumb.value);
				return Ext.String.format('<b>{0}</b>',  Rally.util.DateTime.format(tickerDate, "m/d/Y"));
			},
			listeners: {
				'changecomplete': this.onDateChanged,
				scope: this
			}
		});
    
		this.down('#cardboardHolder').add({
			xtype: 'historicalcardboard',
			itemId: 'cardboard',
			types: ['HierarchicalRequirement', 'Defect'],
			attribute: 'KanbanState',
			viewDate: 'current',
			columnConfig: {
				appContext : this.context
			},
			columns: [ { value: "Initial AC" }, { value: "Ranked" }, { value: "In Dev" }, { value: "In Test" }, { value: "Accepted" }, { value: "Merged" } ]
		});
    },
    
    playClicked: function(){
    	if(this.playTimer){
    		clearTimeout(this.playTimer);
    		delete this.playTimer;
    	}
    	else{
    		var boundNextTick = Ext.bind(this.nextTick, this);
    	
    		// reset the slider to 0
	    	this.down('#dateSlider').setValue(0);
	    	this.playTimer = setTimeout(boundNextTick, 6000);
    	}
    },
    
    nextTick: function(){
    	var boundNextTick = Ext.bind(this.nextTick, this);
    
    	var current = this.down('#dateSlider').getValue();
    	var nextVal = current +1;

    	if(nextVal <= this.noDays){
	    	this.down('#dateSlider').setValue(nextVal);
	    	this.playTimer = setTimeout(boundNextTick, 6000);
	    }else{
	    	delete this.playTimer;
	    }
    },
    
    onStartDateChange: function(){
    	var newStart = this.getStartDate();
    	var newEnd = Rally.util.DateTime.add(newStart, "day", 10);
    	this.down('#endDateField').setValue(newEnd);
    	this.down('#dateSlider').setValue(0);
    },
    
    onEndDateChange: function(){
    	var newEnd = this.getEndDate();
    	var newStart = Rally.util.DateTime.add(newEnd, "day", -10);
    	this.down('#startDateField').setValue(newStart);
    	
    	this.down('#dateSlider').setValue(this.noDays);
    },
    
    getStartDate: function(){
    	return this.down('#startDateField').getValue();
    },
    
    getEndDate: function(){
    	return this.down('#endDateField').getValue();
    },
    
    setCurrentDate: function(newDate){
    	this.currentDate = newDate;
    	this.setTitleDate(newDate);
    	this.down('#cardboard').updateViewDate(newDate);
    },
    
    setTitleDate: function(date){
    	var title = '<h1>Current Date: '+ Rally.util.DateTime.format(date, "m/d/Y T(P)") +'</h1>';
    	this.down('#titleDate').update(title);
    },
    
    getDateSliderValue: function(){
    	var tickCount = this.down('#dateSlider').getValue();
    	var date = Rally.util.DateTime.add(this.getStartDate(), "day", tickCount);
    	return date;
    },
    
    onDateChanged: function(slider, newTickCount){
    	var newDate = this.getDateSliderValue();
    	this.setCurrentDate(newDate);
    }
});
