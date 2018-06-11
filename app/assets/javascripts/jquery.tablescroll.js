(function($){
  $.fn.tablescroll = function(user_options){
    var opt = $.extend($.fn.tablescroll.options, user_options);
 
    return this.each(function(){
      var table = $(this);

      if (table.filter('.tablesorter_avoid').length > 0){
        return true;
      }
 
      if (table.filter('.tablescroll_processed').length == 0){
          $.fn.tablescroll.prepare(table);
          table.addClass('tablescroll_processed');
      }
 
      var scroller = table.parents('.tablescroll_scroller');
      if (scroller.length > 0 && opt.vsize != null){
        if (opt.vsize == 'window'){
          var window_height = $(window).height();
          var offset = scroller.offset();
  
          var height = $(window).height() -  scroller.offset().top - opt.windowmargin; 
  
          if (height < parseInt(table.height())){
            scroller.css('height', height).width(table.outerWidth() + 16);
          }else{
            scroller.css('height', table.css('height')).width(table.outerWidth() + 16);
          }
        }else{
          if (opt.vsize < parseInt(table.height())){
            scroller.css('height', opt.vsize).width(table.width() + 16);
          }else{
            scroller.css('height', table.css('height'));
          }
        }
      }
    })
  }
 
  $.fn.tablescroll.options = {
    vsize: '',
    windowmargin: 50,
    scrollsize: '16px'
  }
 
  
  $.fn.tablescroll.tag = function(name){
    return($('<' + name + '></' + name + '>'));
  }

  $.fn.tablescroll.prepare = function(table){
    $.fn.tablescroll.prepare.div_hack(table);
  }


  $.fn.tablescroll.prepare.div_hack = function(table){
    var table_width = table.outerWidth();
    var fields = table.find('tbody > tr:nth-child(1) > td');

    // Computer percentage sizes
    var sizes = $.map(fields, function(elem, i){ return($(elem).outerWidth())});

    var total = 0;
    $(sizes).each(function(){total += this })
    sizes = $.map(sizes, function(elem, i){return( ((elem * 100)/total).toString() + '%') });

    // Separate header
    if (table.find('thead').length > 0){
      var header_table = tag('table');
      header_table.insertBefore(table);

      // Set same class to header_table as original table
      header_table.addClass(table.attr('class')).addClass('tablescroll_headers');

      // Relocate headers
      header_table.append(table.find('thead').remove());

      // Reset table widths
      var i = 0; table.find('tbody > tr:nth-child(1) > td').each(function(){ 
        $(this).width(sizes[i]); i++; 
      })


      // Reset header widths
      var i = 0; header_table.find('thead > tr:nth-child(1) > th').each(function(){ 
        $(this).width(sizes[i]); i++;       
      })

      // Set ids
      if (table.attr('id') != ""){
        var id = table.attr('id');
        header_table.attr('id', id + '_headers').attr('data-content', id);
        table.attr('data-headers', id + '_headers');
      }
      header_table.addClass('tablesorter_avoid');
      header_table.width(table_width);

      // Remove space
      header_table.css('margin-bottom',0).css('padding-bottom',0);
      table.css('margin-top',0).css('padding-top',0);
    }

    // Add scroll div
    var div = tag('div').addClass('tablescroll_scroller').css('overflow-y', 'auto').css('overflow-x', 'hidden');
    table.wrap(div);
    table.addClass('tablescroll_content');

    table.width(table_width);
    table.addClass('tablescroll_processed');
  }

  $.fn.tablescroller = function(){
    var table = $(this);
    if (table.parents('.tablescroll_scroller').length > 0){
      return table.parents('.tablescroll_scroller');
    }
    if (table.find('.tablescroll_scroller').length > 0){
      return table.find('.tablescroll_scroller');
    }
    return null;
  }
})(jQuery)

