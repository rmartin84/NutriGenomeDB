(function($){
  $.widget("ui.hitarea", $.extend({}, $.ui.mouse, {
    _init: function() {
      this.element.addClass("ui-hitarea");
      this.jg = null; 
      this.name = this.element.attr('id');

      this.lasso = this._getData('lasso');
      this._mouseInit();
      this.helper = $(document.createElement('div'))
            .css({border:'1px dotted black', 'background-color': this._getData('select_color'),'opacity':'0.4','filter':'alpha(opacity=40)'})
            .addClass("ui-selectable-helper");
    },

    destroy: function(){ 
      this.reset();
      this.jg = null; 
      this._mouseDestroy();
    },
    
    _percent: function(position){
      var top   = this.element.offset().top;
      var vsize = this.element.height();
      return((position - top) / vsize);
    },

    _area: function(start, end){
      var top = 0;
      var bottom = 0;
      
      if (start > end){
        top = start;
        bottom = end;
      }else{
        top = end;
        bottom = start;
      }

      return {top: top, bottom: bottom};
    },

    _mouseStart: function(e){ 
      if (this.vertical){
        this._setData('start', this._percent(e.pageY)); 
      }else{
        this._setData('start', this._percent(e.pageX)); 
      } 
     
      if (this.lasso){
        $('body').append(this.helper);
        this.opos = [e.pageX, e.pageY];

        this.helper.css({
              "z-index": 100,
              "position": "absolute",
              "left": e.clientX,
              "top": e.clientY,
              "width": 0,
              "height": 0
        });
      }

      return(true);
    },   
   _mouseDrag: function(e){
      if (this.lasso){
        var x1 = this.opos[0], y1 = this.opos[1], x2 = e.pageX, y2 = e.pageY;
        if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
        if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
        this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});
      }

   },

    _mouseStop: function(e){ 
      if (this.vertical){
        var actual= this._percent(e.pageY); 
      }else{
        var actual= this._percent(e.pageX); 
      }

      var area = this._area(this._getData('start'), actual);

      if (this.lasso){
        this.helper.remove();
      }

      this._trigger('selected', e, area);
    }, 


    reset: function(){ 
      if (this.jg != null){
        this.jg.clear();
      }else{
        this.jg = new jsGraphics(this.name);
      }
    },

    hits: function(list, options) {
      var opt = $.extend(this.options, options);
      
      this.list = list;
      this.vertical = opt.vertical;

      this.reset();

      var left  = 0;
      var top   = 0;
      var hsize = this.element.width();
      var vsize = this.element.height();

      var jg = this.jg;

      // Set main color
      jg.setColor(opt.color);
      jg.fillRect(left,top, hsize,vsize);

      if (opt.vertical){
        jg.setColor(opt.up_color);
        jg.fillRect(left,top, hsize, vsize * opt.up);

        jg.setColor(opt.down_color);
        jg.fillRect(left,top + vsize * (1 - opt.down), hsize, vsize * opt.down);


        jg.setColor(opt.hit_color);
        $(list).each(function(){
          var pos = this * vsize;
          jg.drawLine(left, top + pos ,left + hsize - 1, top + pos );
        })
      }else{

        jg.setColor(opt.up_color);
        jg.fillRect(left,top, hsize * opt.up, vsize);

        jg.setColor(opt.down_color);
        jg.fillRect(left + hsize * ( 1 - down),top, hsize * opt.down, vsize);


        jg.setColor(opt.hit_color);
        $(list).each(function(){
           var pos = this * vsize;
           jg.drawLine(left + pos, top, left + pos,  top + vsize - 1 );
         })
      }
      jg.paint();
    }


  }));

  $.extend($.ui.hitarea, {
      defaults: {
        up_color: 'green',
        down_color: 'red',
        hit_color: 'black',
        color: 'blue',
	select_color:'#ecf169', 
        lasso: false,
        up: 0,
        down: 0,
        distance: 10,
        delay: 1
      }
  });
})(jQuery)

