function json(text){
  var data;
  eval("data = " + text);
  return(data);
}

function tag(name){
  return($('<' + name + '></' + name + '>'));
}

function random_name(){
  return(Math.floor(Math.random() * 10000000));
}

function percent(e, elem){
  var top = $(elem).offset().top;
  var mtop = e.pageY;
  var vsize = $(elem).height();
  var percent = (mtop - top) / vsize;

  return(percent);
}


function findPos(obj){
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return [curleft,curtop];
}

function fit_window(elem,margin){
   var height;
   height = $(window).height() - findPos(elem[0])[1] - margin;
   elem[0].style.height = height.toString() + "px";
}

function clear_textareas(){
  $('textarea').after('<a class="clear textarea_link" href="#">[clear]</a>');
  $('a.clear').click(
    function(){
      $(this).prev().attr('value','')
      return(false);
    })
}  

function post(URL, PARAMS, NEW_WINDOW) {
  var temp=document.createElement("form");
  temp.action=URL;
  temp.method="POST";
  temp.style.display="none";

  if (NEW_WINDOW){
    temp.target = "_blank";
  }

  for(var x in PARAMS) {
    var opt=document.createElement("textarea");
    opt.name=x;
    opt.value=PARAMS[x];
    temp.appendChild(opt);
  }
  document.body.appendChild(temp);
  temp.submit();
  return temp;
}


jQuery().ready(function() {
  jQuery("#loadExample").click(function fill_ids(evt){
    evt.preventDefault(); 
    var up = "HSP12\nYLR042C\nRFX1\nYPL088W\nYHL010C\nYHR087W\nCRG1\nDAL7\nHAL1\nSRL3\nGPD1\nPRM5\nPRM10\nPST1\nFMP33\nYLR194C\nCTT1\nSLT2\nYLR040C\nYKE4\nDDR48\nYLR414C\nCWP1\nYMR315W\nPIR3\nYPS3\nYIL024C\nYGL157W\nSED1\nGAT1\nGRE3\nYGR146C\nOAZ1\nNQM1\nKTR2\nSPI1\nPCM1\nSTF2\nPPX1\nHMX1\nMDN1\nMSB3\nCAK1\nYCL049C\nSIP18\nPNS1\nFIR1\nSVS1\nGPG1\nDAN4\nYNL058C\nSYM1\nSBE22\nYET1\nRBK1\nCRH1\nALD4\nPGM2\nYDR262W\nKRE11\nMCH5\nGRE2\nNUP85\nECM4\nSOL4\nHOR2\nTMA10\nMSG5\nYJL171C\nYJR008W\nYML131W\nDFG5\nPNC1\nPRY2\nCIS3\nGDB1\nRCR1\nYOL019W\nORC6\nSWC7\nSPG5\nPET10\nATG8\nPEX27\nYKL161C\nICT1\nTFS1\nGOR1\nBGL2\nDOG2\nGFA1\nIAH1\nMSB4\nDCS2\nYJL160C\nTIR2\nSMF1\nBZZ1\nMSC1\nFYV8\nRGS2\nEXG1\nFAS2\nCIT1\nDUN1\nYHR097C\nYMR181C\nSOR1\nCHS7\nRCN2\nYEH1\nACA1\nYNL194C\nYML087C\nGTT1\nECM13\nYHR033W\nDOG1\nENT3\nTHI22\nMET28\nYKL151C\nATP22\nSOM1\nFRE2\nHXT1\nYSP3\nYPR1\nSOL1\nAGX1\nFMP48\nIML2\nMID2\nNCA3\nYDL114W\nYOL048C\nYNR065C\nSLU7\nPTP2\nYNL208W\nYKL121W\nVPS27\nHXK1\nMET16\nHSP32\nLSC2\nYMR090W\nSLD2\nYIL108W\nPRR1\nGIC2\nPRX1\nADD37\nCMK2\nYPL23HSP12\nYLR042C\nRFX1\nYPL088W\nYHL010C\nYHR087W\nCRG1\nDAL7\nHAL1\nSRL3\nGPD1\nPRM5\nPRM10\nPST1\nFMP33\nYLR194C\nCTT1\nSLT2\nYLR040C\nYKE4\nDDR48\nYLR414C\nCWP1\nYMR315W\nPIR3\nYPS3\nYIL024C\nYGL157W\nSED1\nGAT1\nGRE3\nYGR146C\nOAZ1\nNQM1\nKTR2\nSPI1\nPCM1\nSTF2\nPPX1\nHMX1\nMDN1\nMSB3\nCAK1\nYCL049C\nSIP18\nPNS1\nFIR1\nSVS1\nGPG1\nDAN4\nYNL058C\nSYM1\nSBE22\nYET1\nRBK1\nCRH1\nALD4\nPGM2\nYDR262W\nKRE11\nMCH5\nGRE2\nNUP85\nECM4\nSOL4\nHOR2\nTMA10\nMSG5\nYJL171C\nYJR008W\nYML131W\nDFG5\nPNC1\nPRY2\nCIS3\nGDB1\nRCR1\nYOL019W\nORC6\nSWC7\nSPG5\nPET10\nATG8\nPEX27\nYKL161C\nICT1\nTFS1\nGOR1\nBGL2\nDOG2\nGFA1\nIAH1\nMSB4\nDCS2\nYJL160C\nTIR2\nSMF1\nBZZ1\nMSC1\nFYV8\nRGS2\nEXG1\nFAS2\nCIT1\nDUN1\nYHR097C\nYMR181C\nSOR1\nCHS7\nRCN2\nYEH1\nACA1\nYNL194C\nYML087C\nGTT1\nECM13\nYHR033W\nDOG1\nENT3\nTHI22\nMET28\nYKL151C\nATP22\nSOM1\nFRE2\nHXT1\nYSP3\nYPR1\nSOL1\nAGX1\nFMP48\nIML2\nMID2\nNCA3\nYDL114W\nYOL048C\nYNR065C\nSLU7\nPTP2\nYNL208W\nYKL121W\nVPS27\nHXK1\nMET16\nHSP32\nLSC2\nYMR090W\nSLD2\nYIL108W\nPRR1\nGIC2\nPRX1\nADD37\nCMK2\nYPL230W";
    $("#up").val(up);
  });

});
   

