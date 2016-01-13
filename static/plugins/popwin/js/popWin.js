var moogo = moogo||{};
(function(BS){
	BS.popWin=function(option){
		var self=this;
		this.settings=$.extend({
			width:500,
			height:300,
			isFixed:true
		},option||{});
		this.container=option.container;
		this.scrollTop = 0;
		this.wall=$('<div class="popWall"></div>').appendTo(this.container);
		this.dom=$('<div class="popDom" ><div class="titleDom"><span class="titleCon">'+this.settings.title+'</span><span class="close"></span></div><div class="bodyDom"></div></div>').appendTo(this.container);
		this.dom.css({width: this.settings.width + "px", height: this.settings.height + "px", "left": self.dom.offset().left-(this.settings.width / 2) + "px", "top": self.dom.offset().top-document.body.scrollTop-(this.settings.height / 2) + "px"}); 
		this.title = this.dom.find(".titleDom");
		this.title=this.dom.find(".titleDom");
		this.body=this.dom.find(".bodyDom").append(self.settings.content);
		this.closeDom=this.dom.find(".close");
		this.closeDom.click(function(){
			self.close();
		});
        this.close();
        this.title.mousedown(function(e){
			var temp = self.mousePos(e);
			self.settings.x = temp.x;
			self.settings.y = temp.y;
			self.settings.left =  self.dom.offset().left,
			self.settings.top =  self.dom.offset().top,
			bindEvent();
		});
		this.title.mouseup(function(){
			unbindEvent();
		});
		if(!self.settings.isFixed){
			$(self.container).css({"position":"absolute"});
			$(self.dom).css({"position":"absolute"});
			$(self.wall).css({"position":"absolute"});
		}
		$("body").mouseup(function(){
			unbindEvent();
		});
		function bindEvent(){
			self.title.bind("mousemove", move);
			$("body").bind("mousemove", move);
		}
		function unbindEvent(){
			self.title.unbind("mousemove",move);
			$("body").unbind("mousemove", move);
		}
		function move(e) {
			var tx = self.settings.x - e.clientX,
				ty = self.settings.y - e.clientY,
				left = self.settings.left + (-tx);
				t = self.settings.top +(-ty);
				if(left>0 && left<$(window).width()-self.settings.width){
					self.dom.css({"left":left+"px"});
				}
				if(t>0 && t < $(window).height()-self.settings.height){
					self.dom.css({"top":t+"px"});
				}
		}
	};
	BS.popWin.prototype={
		close:function(){
			var self=this;
			self.container.hide();
			self.settings.closeCallback.call(self);
			//$("body").removeClass("modal-open");
			if(!self.settings.isFixed){
				$("body").animate({
					scrollTop:self.scrollTop+"px"
				},500);
			}
		},
		remove:function(){
			var self=this;
			self.container.remove();
			//$("body").removeClass("modal-open");
		},
		show:function(){
			var self=this;
			// recalc window size on resizing:
			$(window).resize(function() {
				self.setMaskHeight();
			});
			self.setMaskHeight();
			self.settings.content.show();
			self.container.show();
			//$("body").addClass("modal-open");
			if(!self.settings.isFixed){
				self.scrollTop = $("body").scrollTop();
				$("body").animate({
					scrollTop:0
				},500);
			}
		},
		setContent:function(o){
			var self=this;
			self.body.html(o);
		},
		setMaskHeight:function(){
			try {
				var self=this;
				// get height of page for the mask:
				var body = document.body, html = document.documentElement;
				//$(".popWall").height(Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) + "px");
				var popDom =  self.settings.content.parents(".popDom");
				var top = (html.clientHeight-popDom.height())/2;
				var left = (html.clientWidth-popDom.width())/2;
				if(left<20){left = 20; } 
				if(top<20){top = 20; } 
				popDom.css({
					left:left+"px",
					top:top+"px"
				});
			} catch (e) {}
		},

		mousePos: function(e) {
			var x, y;
			var e = e || window.event;
			return {
				x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
				y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
			}
		}
	};
	
})(moogo);