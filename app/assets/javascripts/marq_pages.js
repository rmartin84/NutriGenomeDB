/* RESULTS MAIN */
var hits  = [];
var up    = 0;
var down  = 0;
var inprocess = false;


function reset_checkboxes(){
   $('input:checkbox').each( function() {
       this.checked = false;
   });
}

function has_term(terms, annotation){
  for(term in terms)
    if (annotation == terms[term]) return true
  return false
}

function mark(type, annotation){
  set_status("Marking " + type + ": " + annotation + '...')
  var experiments = $('table#table_results > tbody > tr');
  var total = experiments.length;
  hits = [];

  var i = 0;
  experiments.each(function(){
    var e = $(this);
    var terms = annotations[type][e.attr('id')];      

    if (has_term(terms, annotation)){
      hits.push(i/total);
      e.addClass('marked');
    }else{
      e.removeClass('marked');
    }
    i = i + 1;
  })
  hide_status()
}

function update_hits_main(){
  $("#canvas").hitarea('hits', hits, {up: up, down: down, vertical: true});
}


function fit_size_main(){
  var scroller = $('#table .table_scroller');

  fit_window(scroller, 45)

 
  $('#canvas').css('margin-top', scroller[0].offsetTop - 3);
  $('#canvas').height(parseInt(scroller.css('height')));
}


function up_down(){
  var experiments = $('table#table_results > tbody > tr');
  var total = experiments.length;

  up   = 0;
  down = 0;
  experiments.each(function(){
    var e = $(this);
    var str = e.find('td.pvalue').html();
    if (str.match(/0\.00/)){ str = '0';}
    var pvalue = parseFloat(str);
    var score =  parseFloat(e.find('td.score').html());

    if (pvalue < 0.05){
      if (score > 0){
        up = up + 1;
      }else{
        down = down + 1;
      }
    }
  })

  up = up/total;
  down = down/total;
}


function update_annotations(cell){
  cell = $(cell);
  var list       = cell.find('ul.annotation_types');
  var experiment = cell.parents('tr').attr('id');
  var positive   = parseFloat(cell.parents('tr').find('td.score').html()) > 0;

  list.children().remove();

  for (var type in annotations) {
    
    if (type != "Words"){
      if (type == selected_annotation_type){
        var name = type;

        if (positive){
          name = name.replace(/_direct/," terms enriched in <span class=bold>up</span> genes").replace(/_inverse/, " terms enriched in <span class=bold>down</span> genes")
        }else{
          name = name.replace(/_inverse/," terms enriched in <span class=bold>up</span> genes").replace(/_direct/, " terms enriched in <span class=bold>down</span> genes")
        }
       

        var title = tag('h5').html(name).addClass('title');
        var ul = tag('ul').attr('id', type).addClass('annotations');

        var terms = annotations[type][experiment];      
        for (var i in terms) {
          var term = terms[i];
          var li = tag('li');
          li.html(term)

          li.click(click_term);

          ul.append(li);
        }

        var type_list = tag('li');
        type_list.append(title).append(ul);
        list.append(type_list);
      }
    }
    // Words are treated different, put triggers in the actual text
    else{
      var terms = annotations[type][experiment];      

      var title = cell.find('span.title');
      title.html(title.attr('data-span_words'));

      var test = cell.find('span.test');
      var condition = test.find('span.condition');
      test.html(test.attr('data-span_words')).append(condition);

      cell.find('span.word').each(function(){
        var span = $(this);
        if (jQuery.inArray(span.attr('data-stem'), terms) >= 0){
          span.click(click_word).addClass('click');
        }
      })
    }
  }      
}

function click_term(){
  if (inprocess){
    return false;
  }
  inprocess = true;
  var type = $(this).parents('ul.annotations').attr('id');
  var annotation = $(this).html();

  mark(type,annotation); 
  update_hits_main();
  inprocess = false;
}

function click_word(){
  if (inprocess){
    return false;
  }
  inprocess = true;
  var annotation = $(this).attr('data-stem');

  mark('Words',annotation); 
  update_hits_main();
  inprocess = false;
}

function cell_togle(cell){
  var cell = $(this).parents('td');

  var link = $(this);
  if (cell.find('.info').length > 0){
    cell.find('.info').toggle();
  }else{
    var experiment = $(cell).parents('tr').attr('id');
    link.hide();
    $.ajax({
      url: "/experiment_info?job=" + job + "&experiment=" + encodeURIComponent(experiment),
      success: function(html){
        var info = $('<div class="info"></div>');
        info.append($(html));
        cell.append(info);
        update_annotations(cell);
        link.html('[-]');
        link.show();
      }
    })
  }

  if (cell.find('.info').is(':visible'))
    link.html('[-]');
  else
    link.html('[+]');

  return(false);
}

function scroll_to_main(e){
  var p = percent(e, this);

  var table = $('table#table_results')
  var rows = table.find('tbody > tr')
  var num_rows = rows.length;

  var position = Math.round(num_rows * p)
  position = Math.max(0, position);
  

  for (var offset = 0; offset < num_rows * 0.01; offset++){
    if ($(rows[position + offset]).hasClass('marked') || position + offset == num_rows - 1){
      position = position + offset;
      break;
    }
    if ($(rows[position - offset]).hasClass('marked') || position - offset == 0){
      position = position - offset;
      break;
    }
  }

  if (position == 0){ position = 1;}

  var selected = rows[position - 1];

  $('#table .table_scroller').scrollTo($(selected),1000);
}

function load_annotations(type){
  $.ajax({
    url: '/annotations?job=' + job +'&type=' + type, 
    beforeSend: function(){set_status("Loading annotations: " + type + "...")},
    complete: function(){hide_status()},
    success: function(data){ 
    set_status("Preparing annotations: " + type + "...")
      annotations[type] =  json(data)['annotations']; 
      enrichment[type] =  json(data)['terms']; 
      $('td.experiment > .info').each(function(){ update_annotations($(this).parents('td.experiment')) })
    }
  })
}

function prepare_selects(){
    $('.compare_select:checked, .compare_invert:checked').each(function(){
      $(this).attr('checked', false)
    })

    $('.compare_select').click(function(){
      $('.compare_invert[id=' + $(this).attr('id').replace(/up/,"down") +']').attr('checked',false)
    })
    
    $('.compare_invert').click(function(){ 
       $('.compare_select[id=' + $(this).attr('id').replace(/down/,"up") +']').attr('checked',false)
    })

    $('#compare_link').click(function(){
      var experiments = ""
      var invert = ""
      $('.compare_select:checked').each(function(){
        experiments += $(this).attr('name') + "|";
      })
      $('.compare_invert:checked').each(function(){
        experiments += encodeURI($(this).attr('name')) + "|";
        invert += $(this).attr('name') + "|";
      })
      post('/compare', {job: job, experiments: experiments, invert: invert}, true);
      //window.open('/compare?job=' + job + '&experiments=' + experiments + '&invert=' + invert)
      return false;
    })
} 

     

function start_results_main(){
  load_annotations("Words")
  prepare_selects()
  $('a.toggle').click(cell_togle);
  
  $('#canvas').hitarea({
    color:      '#618bc7', //'#183152',
    up_color:   '#ecf169', // '#e8ec83', //'#E1E6FA',
    down_color: '#ecf169', //'#e8ec83', //'#E1E6FA',
    hit_color:  '#7f2153'  //'#ef72a7', //'#d293a9', //'#009200'
  });
  $('#canvas').dblclick(scroll_to_main);

  $('#table').width($('#table_results_headers').width() + 20);
  up_down();

  fit_size_main();
  $('#canvas').show();

  update_hits_main();

  $(window).resize(function(){
    set_status("Resizing Table...")
    fit_size_main()   
    update_hits_main();
    hide_status();
  });

  $(window).unbind('unload')
  $(window).bind('unload',function(){
    $('table#table_results > tbody > tr > td.experiment > a.toggle').unbind('click');
    $('table#table_results > tbody > tr > td.experiment > div.info > dl.annotation_types > dd > span ').unbind('click');
  })
} 

/*  RESULTS HITS */


  var genes = [];

  function update_hits_hits(){
    var hits = $('table#table_genes > tbody > tr > td.hit').map(function(){ return($(this).html() / total_genes) });
    $("#canvas").hitarea('hits', hits, {up: 0, down: 0, vertical: true});
  }

  function fit_size_hits(){
    var scroller = $('.table_scroller');

    fit_window(scroller, 43);
    var height = scroller.css('height');

    $('#canvas').height(parseInt(height));
    $('#canvas').css('margin-top', scroller[0].offsetTop - 3);
  }

  function scroll_to_hits(e){
    var p = percent(e, this);
    var position = p * total_genes;

    position = Math.max(0, position - 4);

    var table = $('table#table_genes')
    var rows = table.find('tbody > tr')

    var selected = null
    rows.each(function(){
      selected = $(this);
      if (parseInt($(this).find('td.hit').html()) > position){
        return false
      }
    })

    $('.table_scroller').scrollTo($(selected),1000);
  }

  function unselect(element){
    element.removeClass('marked');
  }

  function select(element){
    element.addClass('marked');

    var name = element.attr('id');
    genes.push(name);
  }

  function selected(event, area){
    genes = [];
    var first = null;
    $('table#table_genes > tbody > tr').each(function(){ 
      unselect($(this));
      var position = parseInt($(this).find('td.hit').html()) / total_genes;
      if (position <= area.top && position >= area.bottom){
        if (first == null){
          first = this;
        }
        select($(this));
      }
    });
    $('.table_scroller').scrollTo($(first),1000);
  }

  function start_results_hits(){
    $('#canvas').hitarea({
      color:      '#618bc7', //'#183152',
      up_color:   '#ecf169', //'#E1E6FA',
      down_color: '#ecf169', //'#E1E6FA',
      hit_color:  '#7f2153', //'#e8ec83', //'#ABC8E2',
      lasso: true,
      selected: selected
    });
    $('#canvas').bind('dblclick', scroll_to_hits);

    $('#genes_hits').width($('#table_genes_headers').width() + 20);

    fit_size_hits();   
    $('#canvas').show();
    update_hits_hits();

    $(window).resize(function(){
      fit_size_hits()   
      update_hits_hits();
    });

    $('a.selected_genes').click(function(){
      post('/genes', {genes: genes.join('|')}, false);
      return(false);
    })

    $('a.logratios_hits').click(function(){
      post('/logratios', {job: job, experiment: experiment, genes: genes.join(',')}, false);
      return(false);
    })

    $('a.ts_hits').click(function(){
      post('/ts', {job: job, experiment: experiment, genes: genes.join(',')}, false);
      return(false);
    })

    $('a.ps_hits').click(function(){
      post('/ps', {job: job, experiment: experiment, genes: genes.join(',')}, false);
      return(false);
    })




    $(window).unbind('unload')
    $(window).bind('unload',function(){
      $('a.selected_genes').unbind('click');
    })
  }
  

/* Annotations */

var selected_annotation_type = "Words";

function insert_in_table(tbody, term, value, support){
  var done = false;

  var trs = tbody.find('tr');
  if(trs.length > 0){
    trs.each(function(){
      var row_value = parseFloat($(this).attr('data-value'));
      if (row_value > value ||
          row_value == value && 
            support > parseFloat($(this).attr('data-support'))
         ){

        var tr = tag('tr');
        tr.append(tag('td').addClass('term').html(term));
        if (value == 0){
          tr.append(tag('td').addClass('value').html('< 0.001'));
        }else{
          tr.append(tag('td').addClass('value').html(parseInt(value * 10000) / 10000));
        }
        tr.attr('data-support', support);
        tr.attr('data-value', value);
        $(this).before(tr);

        done = true;
        return false;
      }
    })
  }
  if (!done){
    var tr = tag('tr');
    tr.append(tag('td').addClass('term').html(term));
    if (value == 0){
      tr.append(tag('td').addClass('value').html('< 0.001'));
    }else{
      tr.append(tag('td').addClass('value').html(parseInt(value * 10000) / 10000));
    }
 
    tr.attr('data-support', support);
    tr.attr('data-value', value);
    tbody.append(tr);
  }
}

function update_annotations_table(){
  
  $('#enrichment_table_div').show();
  var type = $('#annotations_select').val();
  terms = enrichment[type];

  selected_annotation_type = type;
  if (terms === undefined && type != ''){
    if (!working){
      status_callback= function(){
        status_callback = null;
        $('#enrichment_table > tbody').show();
        $('#annotations_select').show();
        $('#enrichment_waiting').remove();
        update_annotations_table();
      }
      $('#annotations_select').hide();
      $('#enrichment_table > tbody').hide().after(tag('span').attr('id','enrichment_waiting').html("Loading, please wait..."));
      $('#enrichment_waiting').show();
      load_annotations(type);
    }else{
      $('#annotations_select').val('');
    }
  }else{
    $('td.experiment > .info').each(function(){ update_annotations($(this).parents('td.experiment')) })
    $('#enrichment_table').attr('data-type',type);
    var tbody = $('#enrichment_table > tbody')
    tbody.children().remove();
    for (term in terms){
      var value = terms[term]['pvalue'];
      var hits = terms[term]['hits'];

      // This will invert the order of words, sparse words seem better
      if (type == "Words"){
        hits = -hits;
      }

      if (value < 0.1){
        insert_in_table(tbody, term, value, hits)
      }
    }

    if ($('#enrichment_table').height() > 300){
      $('#enrichment_table_div').height(300);
    }else{
      $('#enrichment_table_div').height('');
    }

    tbody.find('td.term').click(click_annot_term)
  }
}

function click_annot_term(){
  var type = $('#enrichment_table').attr('data-type');
  var term = $(this).html();
  mark(type, term);
  update_hits_main();
}

