var moogo = moogo||{};
(function(BS){
	BS.mSlider = function(option){
		var self = this;
		self.settings = $.extend({
			radius:20,
			width:200,
			min:300,
			max:20000
		},option||{});
		//创建dom
		self.container = option.container;
		self.mbg = $("<div class='msliderCon'><div class='msliderBg'></div><div class='msliderLine'></div><div class='minCon' alt='min'><span></span> </div> <div class='maxCon'  alt='max'><span></span> </div></div>");
		self.mbg.appendTo(self.container);
		self.line = self.container.find(".msliderLine");
		self.min = self.container.find(".minCon");
		self.max = self.container.find(".maxCon");
		self.minValue = self.min.find("span");
		self.maxValue = self.max.find("span");
		self.isDrag = false ;
		//actual min
		self.actualMin = self.settings.radius/2;
		//actual max
		self.actualMax = self.settings.width-(self.settings.radius/2);
		//set css 
		self.mbg.css({
			width:self.settings.width+"px"
		});
		self.line.css({
			width:self.settings.width+"px"
		});
		self.min.css({
			left:-self.actualMin+"px"
		});
		self.max.css({
			left:self.actualMax+"px"
		});
		self.minValue.text(self.settings.min);
		self.maxValue.text(self.settings.max);
		self.current ="";
		self.currentType = "";
		self.x = 0;
		self.mbgX = self.mbg.offset().left;
		self.maxw = self.max.position().left;
		self.minw = self.min.position().left;
		//dom bind event
		self.bind();
		return self;
	}
	BS.mSlider.prototype={
		toPX:function(v){ //value to px
			var self = this;
			var px = self.settings.width/self.settings.max;
			return Math.ceil(px);
		},
		setValue:function(o){ //set dom value
			var self = this;
			var dom = o.dom || self.current;
			var currentType = o.currentType || self.currentType;
			$(dom).css({
				left:o.left+"px"
			});
			var v = self.toValue(o.value);
			if(v == self.settings.min){
				v = self.settings.min;
			}
			
			if(o.left >= self.actualMax){
				v = self.settings.max;
			}
			$(dom).find("span").text(v);
			if ( currentType == "min" ){
				self.line.css({
					width:(self.maxw - o.left) + "px",
					left:o.left+self.actualMin+"px"
				});
			}else if(currentType == "max"){

				self.line.css({
					width:(o.left - self.minw) + "px",
					right:(self.actualMax - o.left - self.minw - 15)+"px"
				});
			}
			
		},
		toValue:function(px){//px to value
			var self = this;
			var v = self.settings.max/self.settings.width;
			var temp = "",px = ( px == 0 ?1:px);
			if(self.currentType == "min"){
				if(Math.ceil(v)*px == Math.ceil(v) || Math.ceil(v)*px < self.settings.min){
					temp = self.settings.min;
				}else{
					temp =  Math.ceil(v)*px;
				}
			}else{
				if(Math.ceil(v)*px >= self.settings.max){
					temp = self.settings.max;
				}else{
					temp =  Math.ceil(v)*px;
				}
			}
			return temp;
		},
		move:function(e){//current dom move function
			var self = this;
			var _touch = e.originalEvent.targetTouches[0]; 
			var x = Math.floor(_touch.pageX - self.mbgX);
			if(x < 0){
				self.setValue({left:-self.actualMin,value:0});
				return false;
			}
			if(x >= self.actualMax && self.currentType == "max"){
				self.setValue({left:self.actualMax,value:self.settings.width});
				return false;
			}
			if(self.currentType == "max"){
				if(x <= self.minw){
					self.setValue({left:self.minw,value:self.minw});
					return false;
				}
				if(x > self.minw && x < self.actualMax){
					self.setValue({left:x,value:x});
				}
			}
			if(self.currentType == "min"){
				if(x >= self.maxw){
					self.setValue({left:self.maxw,value:self.maxw});
					return false;
				}
				if(x >= -self.actualMin && x <= self.maxw-self.actualMin){
					self.setValue({left:x,value:x});
				}
				
			}
		},
		start:function(o,e){//current dom touch start function
			var self = this;
			self.current = $(o);
			self.currentType = self.current.attr("alt");
			self.current.css({
				"zIndex":3
			});
			var _touch = e.originalEvent.targetTouches[0]; 
			self.x = _touch.pageX;
			$(o).on("touchmove",function(e){
				self.move(e);
				//e.preventDefault();
			});
			$(o).on("touchend",function(e){
				self.end(e);
				e.preventDefault();
			})
		},
		end:function(){//current dom touch end  function
			var self = this;
			if( self.currentType == "max"){
				self.maxw = self.current.position().left ;
			}
			
			if(self.currentType == "min"){
				self.minw = self.current.position().left ;
			}
			self.current.css({
				"zIndex":1
			});
			self.current.off("touchmove");
			self.current.off("touchend");
			self.isDrag = true;
			if(self.settings.callback){
				self.settings.callback.call(self);
			}
		},
		getValue:function(){//get max and min value 
			var self = this;
			return{
				max:self.max.find("span").text(),
				min:self.min.find("span").text()
			}
		},
		bind:function(){//bind touch start function
			var self = this;
			self.min.on("touchstart",function(e){
				self.start(this,e);
				 e.preventDefault();
			});
			self.max.on("touchstart",function(e){
				self.start(this,e);
				e.preventDefault();
			});
		},
		resetInfo:function(){
			var self = this;
			self.mbgX = self.mbg.offset().left;
			self.maxw = self.max.position().left;
			self.minw = self.min.position().left;
		},
		resetValue:function(){
			var self = this;
			self.currentType = "min";
			self.setValue({left:-self.actualMin,value:0,dom:self.min});
			self.resetInfo();
			self.currentType = "max";
			self.setValue({left:self.actualMax,value:self.settings.width,dom:self.max});
			self.resetInfo();
			self.line.css({
				width:self.settings.width + "px"
			});
			self.isDrag = false;
		}
	}
})(moogo);