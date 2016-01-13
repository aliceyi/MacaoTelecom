	var mogoo = mogoo || {};
	(function(mg){
 		mg.util = {
 			isIphone :function(){
 				return /(iphone\sOS)\s/i.test(navigator.userAgent)
 			},
 			isAndroid :function(){ 
 				return /Android\s+/i.test(navigator.userAgent);
 			},
 			checkInput:function(input){
		        var l = $(input).val().length;
		        var is = $(input).parent().find('li i');
		        is.each(function(i,o){
		            $(o).css('visibility',i<l?'visible':'hidden');
		        })
		        $($(input).parent().find("li")).removeClass("active");
		        $($(input).parent().find("li")[l]).addClass("active");
		    }
 		}
 		mg.pwd = function(obj){
 			var self = this;
 			if(mg.util.isIphone){
				$('#password').css({fontSize:0,lineHeight:0});
				$('#password').val(' ');//解决问题3 时需要先给input先设置一个字串，否则无法输入

			}
			self.dom = obj.dom;
			self.dom.click(function(e){
				var that = this;
				if(this.value==' ')self.dom.val('');
				$($(this).parent().find("li")[0]).addClass("active");
				
				clearInterval(this.timer);
					this.timer = setInterval(function(){
					mg.util.checkInput(that);
				},200);
			});
			self.dom.blur(function(e){
				 clearInterval(this.timer);
			});
			self.dom.keyup(function(e){
				var that = this;

				
				if(mg.util.isIphone){//仅对iphone这样处理
					//因为密码只能为数字，所以可以这样限定
					if(e.keyCode>=48 && e.keyCode<=57){
						var p = $(this).attr('p')||'',//用来存储输入前的值 
						val = p+(e.keyCode-48).toString(); 
						//这里之所以采用把原来的值同步一份到p属性，主要是ios8里当input里有一个字串后，再输入就可以自然输入了，如果再通过脚本追加本次输入就会重复这次输入，而ios的低版本则不能自然输入，所以这里统一以输入前的值追加本次输入赋给当前input 
						if(p.length>=6){
							$(this).val(p.substr(0,6));
							return;
						}
						$(this).attr('p',val);
						$(this).val(val);
					}else if(e.keyCode==8){
						var p = $(this).attr('p')||'',val = p.substr(0, p.length-1);
						$(this).attr('p',val);
						$(this).val(val);
					}
				}
				mg.util.checkInput(this);
			});
			return self;
 		}
 		mg.pwd.prototype ={
 			getValue:function(){
 				var self = this;
 				return self.dom.attr("p");
 			}
 		}

	})(mogoo);
		
		